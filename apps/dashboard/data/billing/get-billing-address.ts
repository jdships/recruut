import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

import type { BillingAddressDto } from '~/types/dtos/billing-address-dto';

export async function getBillingAddress(): Promise<BillingAddressDto> {
  const ctx = await getAuthOrganizationContext();
  const [organization] = await db
    .select({
      billingLine1: organizationTable.billingLine1,
      billingLine2: organizationTable.billingLine2,
      billingCity: organizationTable.billingCity,
      billingPostalCode: organizationTable.billingPostalCode,
      billingState: organizationTable.billingState,
      billingCountry: organizationTable.billingCountry
    })
    .from(organizationTable)
    .where(eq(organizationTable.id, ctx.organization.id))
    .limit(1);

  if (!organization) {
    throw new Error('Organization not found');
  }

  const response: BillingAddressDto = {
    line1: organization.billingLine1 ?? undefined,
    line2: organization.billingLine2 ?? undefined,
    city: organization.billingCity ?? undefined,
    postalCode: organization.billingPostalCode ?? undefined,
    state: organization.billingState ?? undefined,
    country: organization.billingCountry ?? undefined
  };

  return response;
}
