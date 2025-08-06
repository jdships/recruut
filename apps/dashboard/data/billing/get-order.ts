import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { db, eq } from '@workspace/database/client';
import { orderItemTable, orderTable } from '@workspace/database/schema';

import type { OrderDto } from '~/types/dtos/order-dto';

export async function getOrder(): Promise<OrderDto | undefined> {
  const ctx = await getAuthOrganizationContext();

  const [order] = await db
    .select({
      id: orderTable.id,
      status: orderTable.status,
      provider: orderTable.provider,
      currency: orderTable.currency
    })
    .from(orderTable)
    .where(eq(orderTable.organizationId, ctx.organization.id))
    .limit(1);

  if (!order) {
    return undefined;
  }

  const items = await db
    .select({
      id: orderItemTable.id,
      quantity: orderItemTable.quantity,
      productId: orderItemTable.productId,
      variantId: orderItemTable.variantId,
      priceAmount: orderItemTable.priceAmount,
      type: orderItemTable.type,
      model: orderItemTable.model
    })
    .from(orderItemTable)
    .where(eq(orderItemTable.orderId, order.id));

  const response: OrderDto = {
    id: order.id,
    status: order.status,
    provider: order.provider,
    currency: order.currency,
    items: items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      productId: item.productId,
      variantId: item.variantId,
      priceAmount: item.priceAmount ?? undefined,
      type: item.type ?? undefined,
      model: item.model ?? undefined
    }))
  };

  return response;
}
