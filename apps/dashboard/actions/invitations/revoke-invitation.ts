'use server';

import { revalidateTag } from 'next/cache';

import { APP_NAME } from '@workspace/common/app';
import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { InvitationStatus, invitationTable } from '@workspace/database/schema';
import { sendRevokedInvitationEmail } from '@workspace/email/send-revoked-invitation-email';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { revokeInvitationSchema } from '~/schemas/invitations/revoke-invitation-schema';

export const revokeInvitation = authOrganizationActionClient
  .metadata({ actionName: 'revokeInvitation' })
  .inputSchema(revokeInvitationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [invitation] = await db
      .select({
        email: invitationTable.email,
        status: invitationTable.status
      })
      .from(invitationTable)
      .where(
        and(
          eq(invitationTable.organizationId, ctx.organization.id),
          eq(invitationTable.id, parsedInput.id)
        )
      )
      .limit(1);

    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    await db
      .update(invitationTable)
      .set({ status: InvitationStatus.REVOKED })
      .where(
        and(
          eq(invitationTable.organizationId, ctx.organization.id),
          eq(invitationTable.id, parsedInput.id),
          eq(invitationTable.status, InvitationStatus.PENDING)
        )
      );

    if (invitation.status === InvitationStatus.PENDING) {
      try {
        await sendRevokedInvitationEmail({
          recipient: invitation.email,
          appName: APP_NAME,
          organizationName: ctx.organization.name
        });
      } catch (e) {
        console.error(e);
      }
    }

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        ctx.organization.id
      )
    );
  });
