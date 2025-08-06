'use server';

import { revalidateTag } from 'next/cache';

import { isOrganizationAdmin } from '@workspace/auth/permissions';
import { ForbiddenError, NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { invitationTable, Role } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateInvitationSchema } from '~/schemas/invitations/update-invitation-schema';

export const updateInvitation = authOrganizationActionClient
  .metadata({ actionName: 'updateInvitation' })
  .inputSchema(updateInvitationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [invitation] = await db
      .select({
        email: invitationTable.email,
        role: invitationTable.role
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
    if (invitation.role !== Role.ADMIN && parsedInput.role === Role.ADMIN) {
      const currentUserIsAdmin = await isOrganizationAdmin(
        ctx.session.user.id,
        ctx.organization.id
      );
      if (!currentUserIsAdmin) {
        throw new ForbiddenError('Insufficient permissions');
      }
    }

    await db
      .update(invitationTable)
      .set({ role: parsedInput.role })
      .where(eq(invitationTable.id, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        ctx.organization.id
      )
    );
  });
