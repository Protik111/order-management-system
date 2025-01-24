import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { IProduct } from "./product.interface";
import { ProductService } from "./product.service";

const productCreate = catchAsync(async (req: Request, res: Response) => {
  const { ...productData } = req.body;
  const result = await ProductService.createProduct(productData);

  sendResponse<IProduct>(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

const productUpdate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...productData } = req.body;
  const result = await ProductService.updateProduct(id, productData);

  sendResponse<IProduct>(res, {
    statusCode: 200,
    success: true,
    message: "Product updated successfully!",
    data: result,
  });
});

export const ProductController = {
  productCreate,
  productUpdate,
};
