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
import type { OrganizationDetailsDto } from '~/types/dtos/organization-details-dto';

export async function getOrganizationDetails(): Promise<OrganizationDetailsDto> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const [organization] = await db
        .select({
          name: organizationTable.name,
          address: organizationTable.address,
          phone: organizationTable.phone,
          email: organizationTable.email,
          website: organizationTable.website
        })
        .from(organizationTable)
        .where(eq(organizationTable.id, ctx.organization.id))
        .limit(1);

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      const response: OrganizationDetailsDto = {
        name: organization.name,
        address: organization.address ? organization.address : undefined,
        phone: organization.phone ? organization.phone : undefined,
        email: organization.email ? organization.email : undefined,
        website: organization.website ? organization.website : undefined
      };

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.OrganizationDetails,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.OrganizationDetails,
          ctx.organization.id
        )
      ]
    }
  )();
}
