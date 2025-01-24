type OrderProductWithPromotions = {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  discount: number;
  weight: number;
  subTotal: number;
  product: {
    id: string;
    name: string;
    price: number;
    weight: number;
    promotionProducts: {
      promotion: {
        id: string;
        title: string;
        type: string;
        discount: number | null;
      };
    }[];
  };
  promotions: {
    id: string;
    title: string;
    type: string;
    discount: number | null;
  }[];
};

export type OrderDetails = {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subTotal: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  products: OrderProductWithPromotions[];
};
