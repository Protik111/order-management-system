import { z } from "zod";

const createOrderZodSchema = z.object({
  body: z.object({
    customerName: z.string({
      required_error: "Customer name is required",
    }),
    customerEmail: z
      .string({
        required_error: "Customer email is required",
      })
      .email("Invalid email address"),
    orderItems: z
      .array(
        z.object({
          productId: z.string({
            required_error: "Product ID is required",
          }),
          quantity: z
            .number({
              required_error: "Quantity is required",
            })
            .int("Quantity must be an integer")
            .positive("Quantity must be greater than 0"),
        })
      )
      .min(1, "At least one order item is required"),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
};
