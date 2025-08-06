import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { and, asc, db, eq, ne } from '@workspace/database/client';
import { InvitationStatus, invitationTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { InvitationDto } from '~/types/dtos/invitation-dto';

export async function getInvitations(): Promise<InvitationDto[]> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const invitations = await db
        .select({
          id: invitationTable.id,
          token: invitationTable.token,
          status: invitationTable.status,
          email: invitationTable.email,
          role: invitationTable.role,
          createdAt: invitationTable.createdAt,
          lastSentAt: invitationTable.lastSentAt
        })
        .from(invitationTable)
        .where(
          and(
            eq(invitationTable.organizationId, ctx.organization.id),
            ne(invitationTable.status, InvitationStatus.ACCEPTED)
          )
        )
        .orderBy(asc(invitationTable.createdAt));

      const response: InvitationDto[] = invitations.map((invitation) => ({
        id: invitation.id,
        token: invitation.token,
        status: invitation.status,
        email: invitation.email,
        role: invitation.role,
        lastSent: invitation.lastSentAt ?? undefined,
        dateAdded: invitation.createdAt
      }));

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Invitations,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Invitations,
          ctx.organization.id
        )
      ]
    }
  )();
}
