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

const promotionToggleStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { enable } = req.body;
    const { id } = req.params;
    const result = await PromotionService.togglePromotionStatus(id, enable);

    sendResponse<Promotion>(res, {
      statusCode: 200,
      success: true,
      message: "Promtion status updated successfully!",
      data: result,
    });
  }
);

const promotionEdit = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...promotionData } = req.body;
  const result = await PromotionService.editPromotion(id, promotionData);

  sendResponse<Promotion>(res, {
    statusCode: 200,
    success: true,
    message: "Promtion updated successfully!",
    data: result,
  });
});

const getEnabledPromotions = catchAsync(async (req: Request, res: Response) => {
  const result = await PromotionService.getEnabledPromotions();

  sendResponse<Promotion[]>(res, {
    statusCode: 200,
    success: true,
    message: "Promtion fetched successfully!",
    data: result,
  });
});

const deletePromotion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await PromotionService.deletePromotion(id);
  sendResponse<null>(res, {
    statusCode: 200,
    success: true,
    message: "Promtion fetched successfully!",
    data: null,
  });
});

export const PromotionController = {
  promotionCreate,
  promotionToggleStatus,
  promotionEdit,
  getEnabledPromotions,
  deletePromotion,
};
