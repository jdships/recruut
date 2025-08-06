'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { invitationTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteInvitationSchema } from '~/schemas/invitations/delete-invitation-schema';

export const deleteInvitation = authOrganizationActionClient
  .metadata({ actionName: 'deleteInvitation' })
  .inputSchema(deleteInvitationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [invitation] = await db
      .select({})
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
      .delete(invitationTable)
      .where(eq(invitationTable.id, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Invitations,
        ctx.organization.id
      )
    );
  });
