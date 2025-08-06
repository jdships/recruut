import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthContext } from '@workspace/auth/context';
import { db, eq, sql } from '@workspace/database/client';
import { membershipTable, organizationTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  UserCacheKey
} from '~/data/caching';
import type { OrganizationDto } from '~/types/dtos/organization-dto';

export async function getOrganizations(): Promise<OrganizationDto[]> {
  const ctx = await getAuthContext();

  return cache(
    async () => {
      const organizations = await db
        .select({
          id: organizationTable.id,
          logo: organizationTable.logo,
          name: organizationTable.name,
          slug: organizationTable.slug,
          membership: {
            createdAt: membershipTable.createdAt
          },
          membershipCount:
            sql<number>`COUNT(${membershipTable.id}) OVER (PARTITION BY ${organizationTable.id})`.mapWith(
              Number
            )
        })
        .from(organizationTable)
        .leftJoin(
          membershipTable,
          eq(organizationTable.id, membershipTable.organizationId)
        )
        .where(eq(membershipTable.userId, ctx.session.user.id));
      // .groupBy(organizations.id, memberships.createdAt);

      const response: OrganizationDto[] = organizations
        .sort((a, b) => {
          if (!a.membership || !b.membership) {
            return 0;
          }
          return (
            a.membership.createdAt.getTime() - b.membership.createdAt.getTime()
          );
        })
        .map((organization) => ({
          id: organization.id,
          logo: organization.logo ? organization.logo : undefined,
          name: organization.name,
          slug: organization.slug,
          memberCount: organization.membershipCount
        }));

      return response;
    },
    Caching.createUserKeyParts(UserCacheKey.Organizations, ctx.session.user.id),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createUserTag(UserCacheKey.Organizations, ctx.session.user.id)
      ]
    }
  )();
}
