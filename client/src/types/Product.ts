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
