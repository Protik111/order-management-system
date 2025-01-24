export type IPromotion = {
  title: string;
  type: "percentage" | "fixed" | "weighted";
  discount?: number;
  slabs?: {
    minWeight: number;
    maxWeight: number;
    discount: number;
  }[];
  startDate: string | Date;
  endDate: string | Date;
  productIds?: string[];
};
