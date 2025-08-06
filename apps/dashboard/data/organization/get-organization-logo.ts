import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';

export async function getOrganizationLogo(): Promise<string | undefined> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const [organization] = await db
        .select({
          logo: organizationTable.logo
        })
        .from(organizationTable)
        .where(eq(organizationTable.id, ctx.organization.id))
        .limit(1);

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      return organization.logo ? organization.logo : undefined;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.OrganizationLogo,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.OrganizationLogo,
          ctx.organization.id
        )
      ]
    }
  )();
}
