import {
  FixedPromotion,
  PercentagePromotion,
  WeightedPromotion,
} from "./product.interface";

const isWeightedPromotion = (
  promotion: any
): promotion is WeightedPromotion => {
  return promotion.type === "weighted" && Array.isArray(promotion.slabs);
};

const isPercentagePromotion = (
  promotion: any
): promotion is PercentagePromotion => {
  return (
    promotion.type === "percentage" && typeof promotion.discount === "number"
  );
};

const isFixedPromotion = (promotion: any): promotion is FixedPromotion => {
  return promotion.type === "fixed" && typeof promotion.discount === "number";
};

export const ProductUtils = {
  isWeightedPromotion,
  isPercentagePromotion,
  isFixedPromotion,
};
