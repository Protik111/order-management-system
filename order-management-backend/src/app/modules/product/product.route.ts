import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";
import { ProductController } from "./product.controller";

const router = express.Router();

router.post(
  "/",
  validateRequest(ProductValidation.productCreateZodSchema),
  ProductController.productCreate
);

export const ProductRoutes = router;
