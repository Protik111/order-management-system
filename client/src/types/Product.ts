export type IProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  promotion?: {
    type: "percentage" | "fixed";
    value: number;
  };
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  quantity: number | undefined;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  discountedPrice?: number | undefined;
  promotion?: Promotion | null;
}

interface Promotion {
  id: string;
  title: string;
  type: "fixed" | "percentage" | "weighted";
  discount: number | null;
  slabs: PromotionSlab[];
  isEnabled: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PromotionSlab {
  id: string;
  promotionId: string;
  minWeight: number;
  maxWeight: number;
  discount: number;
}
