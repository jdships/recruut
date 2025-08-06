import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

export async function getBillingEmail(): Promise<string> {
  const ctx = await getAuthOrganizationContext();
  const [customer] = await db
    .select({ billingEmail: organizationTable.billingEmail })
    .from(organizationTable)
    .where(eq(organizationTable.id, ctx.organization.id))
    .limit(1);

  return customer?.billingEmail ?? '';
}
