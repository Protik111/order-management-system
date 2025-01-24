import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IPromotion } from "./promotion.interface";
import { Promotion } from "@prisma/client";

const createPromotion = async (payload: IPromotion): Promise<Promotion> => {
  const { title, type, slabs, startDate, endDate, productIds } = payload;

  // Validate if promotion already exists with the same title and overlapping dates
  const existingPromotion = await prisma.promotion.findFirst({
    where: {
      title,
      isEnabled: true,
      startDate: { lte: new Date(endDate) },
      endDate: { gte: new Date(startDate) },
    },
  });

  if (existingPromotion) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Promotion with this title and date range already exists."
    );
  }

  // Validate slabs for weighted promotions
  if (type === "weighted") {
    if (!Array.isArray(slabs) || slabs.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Slabs are required for weighted promotions."
      );
    }
    slabs.forEach((slab) => {
      if (slab.minWeight >= slab.maxWeight) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Slab minWeight must be less than maxWeight."
        );
      }
    });
  }

  // Validate product IDs (if provided)
  if (productIds && productIds.length > 0) {
    const validProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isEnabled: true,
      },
    });

    if (validProducts.length !== productIds.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "One or more products in the promotion are invalid or disabled."
      );
    }
  }

  // Create the promotion
  const promotion = await prisma.promotion.create({
    data: {
      title,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isEnabled: true,
      discount: type !== "weighted" ? payload.discount : undefined,
      slabs:
        type === "weighted" && Array.isArray(slabs)
          ? {
              create: slabs.map((slab) => ({
                minWeight: slab.minWeight,
                maxWeight: slab.maxWeight,
                discount: slab.discount,
              })),
            }
          : undefined,
      promotionProducts:
        productIds && productIds.length > 0
          ? {
              create: productIds.map((productId) => ({
                productId,
              })),
            }
          : undefined,
    },
    include: {
      slabs: true, // Include slabs in response for weighted promotions
    },
  });

  if (!promotion) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create promotion.");
  }

  return promotion;
};

const getPromotions = async () => {
  return await prisma.promotion.findMany({
    where: {
      isEnabled: true,
    },
  });
};

const disablePromotion = async (promotionId: string) => {
  const promotion = await prisma.promotion.update({
    where: { id: promotionId },
    data: { isEnabled: false },
  });

  if (!promotion) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to disable promotion");
  }

  return promotion;
};

const enablePromotion = async (promotionId: string) => {
  const promotion = await prisma.promotion.update({
    where: { id: promotionId },
    data: { isEnabled: true },
  });

  if (!promotion) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to enable promotion");
  }

  return promotion;
};

const editPromotion = async (
  promotionId: string,
  payload: Partial<IPromotion>
) => {
  const { startDate, endDate, title } = payload;

  const promotion = await prisma.promotion.update({
    where: { id: promotionId },
    data: {
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
      title: title ?? undefined,
    },
  });

  if (!promotion) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to edit promotion");
  }

  return promotion;
};

export const PromotionService = {
  createPromotion,
  getPromotions,
  disablePromotion,
  enablePromotion,
  editPromotion,
};
