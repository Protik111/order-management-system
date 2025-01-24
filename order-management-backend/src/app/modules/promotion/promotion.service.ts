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

const togglePromotionStatus = async (
  promotionId: string,
  enable: boolean
): Promise<Promotion> => {
  // Update the `isEnabled` flag for the promotion
  const updatedPromotion = await prisma.promotion.update({
    where: { id: promotionId },
    data: { isEnabled: enable },
  });

  if (!updatedPromotion) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promotion not found");
  }

  return updatedPromotion;
};

const editPromotion = async (
  promotionId: string,
  updates: { title?: string; startDate?: Date; endDate?: Date }
): Promise<Promotion> => {
  const { title, startDate, endDate } = updates;

  if (!title && !startDate && !endDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No valid fields provided for updating."
    );
  }

  // Ensure that startDate is before endDate
  if (startDate && endDate && startDate >= endDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Start date must be before the end date."
    );
  }

  // Update only the allowed fields
  const updatedPromotion = await prisma.promotion.update({
    where: { id: promotionId },
    data: {
      ...(title && { title }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });

  if (!updatedPromotion) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promotion not found");
  }

  return updatedPromotion;
};

const getEnabledPromotions = async (): Promise<Promotion[]> => {
  const promotions = await prisma.promotion.findMany({
    where: { isEnabled: true },
  });

  if (!promotions || promotions.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No enabled promotions found");
  }

  return promotions;
};

const deletePromotion = async (promotionId: string): Promise<void> => {
  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
  });

  if (!promotion) {
    throw new ApiError(httpStatus.NOT_FOUND, "Promotion not found");
  }

  // Delete all related promotion slabs and promotion products
  await prisma.promotionSlab.deleteMany({
    where: { promotionId },
  });

  await prisma.promotionProduct.deleteMany({
    where: { promotionId },
  });

  // Optionally: If you want to delete related order products that reference the promotion (use with caution)
  // await prisma.orderProduct.updateMany({
  //   where: {
  //     discount: { gt: 0 }, // Assumes that the promotion would apply a discount to order products
  //   },
  //   data: {
  //     discount: 0, // Remove the promotion discount from related order products
  //   },
  // });

  // Now delete the promotion itself
  await prisma.promotion.delete({
    where: { id: promotionId },
  });
};

export const PromotionService = {
  createPromotion,
  togglePromotionStatus,
  editPromotion,
  getEnabledPromotions,
  deletePromotion,
};
