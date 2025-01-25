import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";
import { OrderController } from "./order.controller";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  OrderController.getOrders
);

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.orderCreate
);

router.get(
  "/details/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  OrderController.getOrderDetails
);

export const OrderRoutes = router;
