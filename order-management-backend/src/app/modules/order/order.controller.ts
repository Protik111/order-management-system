import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { OrderDetails } from "./order.interface";
import { OrderService } from "./order.service";
import { Order } from "@prisma/client";

const orderCreate = catchAsync(async (req: Request, res: Response) => {
  const { customerName, customerEmail, orderItems } = req.body;
  const result = await OrderService.createOrder(
    customerName,
    customerEmail,
    orderItems
  );

  sendResponse<Order>(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrders();

  sendResponse<Order[]>(res, {
    statusCode: 200,
    success: true,
    message: "Orders fetched successfully!",
    data: result,
  });
});

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OrderService.getOrderDetails(id);

  sendResponse<OrderDetails>(res, {
    statusCode: 200,
    success: true,
    message: "Order details fetched successfully!",
    data: result,
  });
});

export const OrderController = {
  orderCreate,
  getOrderDetails,
  getOrders,
};
