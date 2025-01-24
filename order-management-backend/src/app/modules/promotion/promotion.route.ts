import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductController } from "./promotion.controller";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { PromotionValidation } from "./promotion.validation";

const router = express.Router();

// router.get(
//   "/",
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
//   ProductController.getProducts
// );

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  validateRequest(PromotionValidation.promotionCreateZodSchema),
  ProductController.promotionCreate
);

// router.patch(
//   "/:id",
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
//   validateRequest(ProductValidation.productUpdateZodSchema),
//   ProductController.productUpdate
// );

// router.delete(
//   "/:id",
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
//   ProductController.deleteUpdate
// );

export const PromotionRoutes = router;
