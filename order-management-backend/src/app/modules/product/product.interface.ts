export type IProduct = {
  name: string;
  description: string;
  price: number;
  weight: number;
  isEnabled?: boolean;
};

export type PromotionType = "percentage" | "fixed" | "weighted";

interface BasePromotion {
  id: string;
  title: string;
  type: PromotionType;
  isEnabled: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PercentagePromotion extends BasePromotion {
  type: "percentage";
  discount: number;
}

export interface FixedPromotion extends BasePromotion {
  type: "fixed";
  discount: number;
}

export interface WeightedPromotion extends BasePromotion {
  type: "weighted";
  discount: null;
  slabs: Slab[];
}

export type Promotion =
  | PercentagePromotion
  | FixedPromotion
  | WeightedPromotion;

export interface Slab {
  id: string;
  promotionId: string;
  minWeight: number;
  maxWeight: number;
  discount: number;
}
