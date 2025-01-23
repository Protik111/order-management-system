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

export const ProductService = {
  createProduct,
};
