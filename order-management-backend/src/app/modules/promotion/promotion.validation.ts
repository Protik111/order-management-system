import { z } from "zod";

const promotionCreateZodSchema = z.object({
  body: z
    .object({
      title: z.string({
        required_error: "Promotion title is required",
      }),
      type: z.enum(["percentage", "fixed", "weighted"], {
        required_error: "Promotion type is required",
      }),
      discount: z.number().nullable().optional(),
      startDate: z
        .string({
          required_error: "Start date is required",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Start date must be a valid date string",
        }),
      endDate: z
        .string({
          required_error: "End date is required",
        })
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "End date must be a valid date string",
        }),
      productIds: z.array(
        z.string().min(1, "At least one product ID is required"),
        {
          required_error: "Product IDs are required",
        }
      ),
      slabs: z
        .array(
          z.object({
            minWeight: z.number({
              required_error: "Minimum weight is required",
            }),
            maxWeight: z.number({
              required_error: "Maximum weight is required",
            }),
            discount: z.number({
              required_error: "Discount is required for each slab",
            }),
          }),
          {
            required_error:
              "At least one slab is required for weighted promotions",
          }
        )
        .optional(),
    })
    .refine(
      (data) => {
        // Handle "discount" validation at a higher level
        if (data.type === "percentage" || data.type === "fixed") {
          if (data.discount === null || data.discount === undefined) {
            return false; // Discount is required for percentage/fixed
          }
        }
        if (data.type === "weighted" && data.discount !== null) {
          return false; // Discount must be null for weighted
        }
        return true;
      },
      {
        message: "Invalid discount value for the selected promotion type.",
      }
    )
    .refine(
      (data) => {
        // Handle "slabs" validation
        if (
          data.type === "weighted" &&
          (!data.slabs || data.slabs.length === 0)
        ) {
          return false; // Slabs are required for weighted
        }
        if (data.type !== "weighted" && data.slabs) {
          return false; // Slabs must not exist for percentage/fixed
        }
        return true;
      },
      {
        message: "Invalid slabs for the selected promotion type.",
      }
    ),
});

const updateStatusZodSchema = z.object({
  body: z.object({
    enable: z.boolean({
      required_error: "Enable status is required",
    }),
  }),
});

export const PromotionValidation = {
  promotionCreateZodSchema,
  updateStatusZodSchema,
};
