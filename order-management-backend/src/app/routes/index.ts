import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductRoutes } from "../modules/product/product.route";
import { PromotionRoutes } from "../modules/promotion/promotion.route";
import { OrderRoutes } from "../modules/order/order.route";
AuthRoutes;

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/promotion",
    route: PromotionRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
