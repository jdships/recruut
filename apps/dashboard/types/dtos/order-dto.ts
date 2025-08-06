export type OrderDto = {
  id: string;
  status: string;
  provider: string;
  currency: string;
  items: OrderItemDto[];
};

type OrderItemDto = {
  id: string;
  quantity: number;
  productId: string;
  variantId: string;
  priceAmount?: number;
  type?: string;
  model?: string;
};
