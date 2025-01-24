import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { PromotionService } from "./promotion.service";
import { Promotion } from "@prisma/client";

const promotionCreate = catchAsync(async (req: Request, res: Response) => {
  const { ...promotionData } = req.body;
  const result = await PromotionService.createPromotion(promotionData);

  sendResponse<Promotion>(res, {
    statusCode: 201,
    success: true,
    message: "Promtion created successfully!",
    data: result,
  });
});

export const ProductController = {
  promotionCreate,
};
