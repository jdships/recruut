'use server';

import { revalidateTag } from 'next/cache';

import { sendInvitationRequest } from '@workspace/auth/invitations';
import { NotFoundError, PreConditionError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { InvitationStatus, invitationTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { resendInvitationSchema } from '~/schemas/invitations/resend-invitation-schema';

export const resendInvitation = authOrganizationActionClient
  .metadata({ actionName: 'resendInvitation' })
  .inputSchema(resendInvitationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [invitation] = await db
      .select({
        email: invitationTable.email,
        token: invitationTable.token,
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
    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new PreConditionError('Invitation already accepted');
    }
    if (invitation.status === InvitationStatus.REVOKED) {
      throw new PreConditionError('Invitation was revoked');
    }

    await sendInvitationRequest({
      email: invitation.email,
      organizationName: ctx.organization.name,
      invitedByEmail: ctx.session.user.email,
      invitedByName: ctx.session.user.name,
      token: invitation.token,
      invitationId: parsedInput.id,
      organizationId: ctx.organization.id
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        ctx.organization.id
      )
    );
  });
