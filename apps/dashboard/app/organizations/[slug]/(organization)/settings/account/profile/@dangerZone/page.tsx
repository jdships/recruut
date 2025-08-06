import * as React from 'react';

import { getAuthContext } from '@workspace/auth/context';
import { db, inArray } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

import { DeleteAccountCard } from '~/components/organizations/slug/settings/account/profile/delete-account-card';

export default async function DangerZonePage(): Promise<React.JSX.Element> {
  const ctx = await getAuthContext();
  const ownedOrganizationIds = ctx.session.user.memberships
    .filter((membership) => membership.isOwner)
    .map((membership) => membership.organizationId);
  const ownedOrganizations =
    ownedOrganizationIds.length > 0
      ? await db
          .select({
            name: organizationTable.name,
            slug: organizationTable.slug
          })
          .from(organizationTable)
          .where(inArray(organizationTable.id, ownedOrganizationIds))
      : [];
  return <DeleteAccountCard ownedOrganizations={ownedOrganizations} />;
}
