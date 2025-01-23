import { z } from "zod";

const productCreateZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Product name is required",
    }),
    description: z.string({
      required_error: "Product description is required",
    }),
    price: z.number({
      required_error: "Price is required",
    }),
    weight: z.number({
      required_error: "Weight is required",
    }),
  }),
});

export const ProductValidation = {
  productCreateZodSchema,
};
