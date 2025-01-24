import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Product } from "@prisma/client";
import { IProduct } from "./product.interface";

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
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  const deletedProduct = await prisma.product.delete({
    where: { id },
  });

  if (!deletedProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to delete product");
  }

  return deletedProduct;
};

const getProducts = async (): Promise<Product[]> => {
  // Fetch products based on the `onlyEnabled` flag
  const products = await prisma.product.findMany({
    where: { isEnabled: true },
  });

  if (!products || products.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No products found");
  }

  return products;
};

export const ProductService = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
};
