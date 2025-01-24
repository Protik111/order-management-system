import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Order, Product } from "@prisma/client";
import { OrderDetails } from "./order.interface";

const createOrder = async (
  customerName: string,
  customerEmail: string,
  orderItems: {
    productId: string;
    quantity: number;
  }[]
): Promise<Order> => {
  // Fetch product details for the order
  // const { customerName, customerEmail, products } = orderInput;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No products provided for the order"
    );
  }

  // Initialize totals
  let subTotal = 0;
  let totalDiscount = 0;

  // Process each product
  const processedProducts = await Promise.all(
    orderItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          promotionProducts: {
            include: {
              promotion: {
                include: {
                  slabs: true, // Include slabs for weighted promotions
                },
              },
            },
          },
        },
      });

      if (!product || !product.isEnabled) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `Product with ID ${item.productId} not found or is disabled`
        );
      }

      let discount = 0;

      // Check for applicable promotions
      const weightedPromotion = product.promotionProducts.find(
        (promoProduct) => promoProduct.promotion.type === "weighted"
      );

      if (weightedPromotion) {
        const applicableSlab = weightedPromotion.promotion.slabs.find(
          (slab) =>
            product.weight >= slab.minWeight && product.weight <= slab.maxWeight
        );
        if (applicableSlab) {
          discount = applicableSlab.discount;
        }
      } else {
        // Check for percentage or fixed promotions
        const otherPromotion = product.promotionProducts.find(
          (promoProduct) =>
            promoProduct.promotion.type === "percentage" ||
            promoProduct.promotion.type === "fixed"
        );

        if (otherPromotion) {
          if (otherPromotion.promotion.type === "percentage") {
            discount =
              ((otherPromotion.promotion.discount || 0) *
                product.price *
                item.quantity) /
              100;
          } else if (otherPromotion.promotion.type === "fixed") {
            discount = (otherPromotion.promotion.discount || 0) * item.quantity;
          }
        }
      }

      // Calculate product subtotal and accumulate totals
      const productSubTotal = product.price * item.quantity;
      const productDiscount = discount * item.quantity;

      subTotal += productSubTotal;
      totalDiscount += productDiscount;

      return {
        productId: product.id,
        quantity: item.quantity,
        weight: product.weight,
        discount: productDiscount,
        subTotal: productSubTotal - productDiscount,
      };
    })
  );

  // Calculate grand total
  const grandTotal = subTotal - totalDiscount;

  // Create the order
  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      subTotal,
      discount: totalDiscount,
      total: grandTotal,
      products: {
        create: processedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          discount: p.discount,
          weight: p.weight,
          subTotal: p.subTotal,
        })),
      },
    },
  });

  return order;
};

const getOrders = async (): Promise<Order[]> => {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: {
            include: {
              promotionProducts: {
                include: {
                  promotion: true, // Include promotion details
                },
              },
            },
          },
        },
      },
    },
  });

  if (!orders || orders.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found");
  }

  return orders.map((order) => ({
    ...order,
    products: order.products.map((orderProduct) => {
      const promotions = orderProduct.product.promotionProducts.map(
        (promoProduct) => promoProduct.promotion
      );
      return {
        ...orderProduct,
        promotions,
      };
    }),
  }));
};

const getOrderDetails = async (orderId: string): Promise<OrderDetails> => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      products: {
        include: {
          product: {
            include: {
              promotionProducts: {
                include: {
                  promotion: true, // Include promotion details
                },
              },
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Map product details with promotions
  const productsWithDiscounts = order.products.map((orderProduct) => {
    const promotions = orderProduct.product.promotionProducts.map(
      (promoProduct) => promoProduct.promotion
    );

    return {
      ...orderProduct,
      promotions, // Add the promotions array for each product
    };
  });

  // Return the full order details with products and promotions
  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total,
    subTotal: order.subTotal,
    discount: order.discount,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    products: productsWithDiscounts,
  };
};

export const OrderService = {
  createOrder,
  getOrders,
  getOrderDetails,
};
