import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PromotionController } from "./promotion.controller";
import { ENUM_USER_ROLE } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { PromotionValidation } from "./promotion.validation";

const router = express.Router();

router.get(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  PromotionController.getEnabledPromotions
);

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  validateRequest(PromotionValidation.promotionCreateZodSchema),
  PromotionController.promotionCreate
);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  PromotionController.promotionEdit
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  PromotionController.deletePromotion
);

router.patch(
  "/status/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MODERATOR, ENUM_USER_ROLE.USER),
  validateRequest(PromotionValidation.updateStatusZodSchema),
  PromotionController.promotionToggleStatus
);

export const PromotionRoutes = router;
