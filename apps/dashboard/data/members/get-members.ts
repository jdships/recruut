import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { asc, db, eq } from '@workspace/database/client';
import { membershipTable, userTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { MemberDto } from '~/types/dtos/member-dto';

export async function getMembers(): Promise<MemberDto[]> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const members = await db
        .select({
          role: membershipTable.role,
          isOwner: membershipTable.isOwner,
          user: {
            id: userTable.id,
            image: userTable.image,
            name: userTable.name,
            email: userTable.email,
            lastLogin: userTable.lastLogin,
            createdAt: userTable.createdAt
          }
        })
        .from(membershipTable)
        .innerJoin(userTable, eq(membershipTable.userId, userTable.id))
        .where(eq(membershipTable.organizationId, ctx.organization.id))
        .orderBy(asc(membershipTable.createdAt));

      const response: MemberDto[] = members.map((member) => ({
        id: member.user.id,
        image: member.user.image ?? undefined,
        name: member.user.name,
        email: member.user.email!,
        role: member.role,
        isOwner: member.isOwner,
        dateAdded: member.user.createdAt,
        lastLogin: member.user.lastLogin ?? undefined
      }));

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Members,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Members,
          ctx.organization.id
        )
      ]
    }
  )();
}
