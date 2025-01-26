import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Product, Promotion, PromotionSlab } from "@prisma/client";
import { IProduct } from "./product.interface";
import { ProductUtils } from "./product.utils";

const createProduct = async (payload: IProduct): Promise<Product> => {
  const { name } = payload;

  const isProductExist = await prisma.product.findFirst({
    where: {
      name,
    },
  });

  if (isProductExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already exists");
  }

  const product = await prisma.product.create({
    data: payload,
  });

  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to create product");
  }

  return product;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>
): Promise<Product> => {
  const { name } = payload;

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (name && name !== existingProduct.name) {
    const isNameTaken = await prisma.product.findFirst({
      where: { name },
    });

    if (isNameTaken) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product name already exists");
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: payload,
  });

  if (!updatedProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update product");
  }

  return updatedProduct;
};

const deleteProduct = async (id: string): Promise<Product> => {
  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  await prisma.orderProduct.deleteMany({
    where: { productId: id },
  });

  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  if (!deletedProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete product");
  }

  return deletedProduct;
};

interface BasePromotion extends Promotion {
  slabs: PromotionSlab[]; // Required for weighted
}

const getProducts = async (): Promise<Product[]> => {
  // Fetch products and their related promotions (if any)
  const products = await prisma.product.findMany({
    where: { isEnabled: true },
    include: {
      promotionProducts: {
        where: { promotion: { isEnabled: true } },
        include: {
          promotion: {
            select: {
              id: true,
              title: true,
              type: true,
              discount: true,
              slabs: true, // Only needed for weighted
              isEnabled: true,
              startDate: true,
              endDate: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  if (!products || products.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No products found");
  }

  const productWithPromotions = products.map((product) => {
    // Type-safe promotion extraction
    const promotions = product.promotionProducts
      .map((pp) => pp.promotion)
      .filter((p): p is BasePromotion => {
        if (!p) return false;
        if (ProductUtils.isWeightedPromotion(p)) return true;
        if (ProductUtils.isPercentagePromotion(p)) return true;
        if (ProductUtils.isFixedPromotion(p)) return true;
        return false;
      });

    // Find active promotion with proper typing
    const activePromotion =
      promotions.find((p) => p.type === "weighted") || promotions[0] || null;

    // Calculate discounted price with type-safe promotion
    let discountedPrice = product.price;
    if (activePromotion) {
      if (ProductUtils.isWeightedPromotion(activePromotion)) {
        const applicableSlab = activePromotion.slabs.find(
          (slab) =>
            product.weight >= slab.minWeight && product.weight <= slab.maxWeight
        );
        discountedPrice = applicableSlab
          ? product.price - applicableSlab.discount
          : product.price;
      } else if (ProductUtils.isPercentagePromotion(activePromotion)) {
        discountedPrice = product.price * (1 - activePromotion.discount / 100);
      } else if (ProductUtils.isFixedPromotion(activePromotion)) {
        discountedPrice = product.price - activePromotion.discount;
      }
    }

    const { promotionProducts, ...restProduct } = product;

    return {
      ...restProduct,
      discountedPrice,
      promotion: activePromotion,
    };
  });

  return productWithPromotions;
};

export const ProductService = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
};
