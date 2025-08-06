export type SubscriptionDto = {
  id: string;
  status: string;
  active: boolean;
  provider: string;
  cancelAtPeriodEnd: boolean;
  currency: string;
  periodStartsAt: Date;
  periodEndsAt: Date;
  trialStartsAt?: Date;
  trialEndsAt?: Date;
  items: SubscriptionItemDto[];
};

type SubscriptionItemDto = {
  id: string;
  quantity: number;
  productId: string;
  variantId: string;
  priceAmount?: number;
  interval: string;
  intervalCount: number;
  type?: string;
  model?: string;
  meteredUnit?: string;
  meteredUsage?: number;
};
