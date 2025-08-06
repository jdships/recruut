'use server';

import { revalidateTag } from 'next/cache';

import {
  isOrganizationAdmin,
  isOrganizationOwner
} from '@workspace/auth/permissions';
import { ForbiddenError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { membershipTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { transferOwnershipSchema } from '~/schemas/members/transfer-ownership-schema';

export const transferOwnership = authOrganizationActionClient
  .metadata({ actionName: 'transferOwnership' })
  .inputSchema(transferOwnershipSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (ctx.session.user.id === parsedInput.targetId) {
      throw new ForbiddenError("You can't transfer ownership on yoursef.");
    }

    const currentUserIsOwner = await isOrganizationOwner(
      ctx.session.user.id,
      ctx.organization.id
    );
    if (!currentUserIsOwner) {
      throw new ForbiddenError('Only owners can transfer ownership.');
    }

    const targetUserIsAdmin = await isOrganizationAdmin(
      parsedInput.targetId,
      ctx.organization.id
    );
    if (!targetUserIsAdmin) {
      throw new ForbiddenError('Only admins can become owners.');
    }

    await db.transaction(async (tx) => {
      await tx
        .update(membershipTable)
        .set({ isOwner: false })
        .where(
          and(
            eq(membershipTable.userId, ctx.session.user.id),
            eq(membershipTable.organizationId, ctx.organization.id)
          )
        );

      await tx
        .update(membershipTable)
        .set({ isOwner: true })
        .where(
          and(
            eq(membershipTable.userId, parsedInput.targetId),
            eq(membershipTable.organizationId, ctx.organization.id)
          )
        );
    });

    revalidateTag(
      Caching.createUserTag(UserCacheKey.Profile, ctx.session.user.id)
    );
    revalidateTag(
      Caching.createUserTag(UserCacheKey.Profile, parsedInput.targetId)
    );
    revalidateTag(
      Caching.createUserTag(UserCacheKey.Organizations, ctx.session.user.id)
    );
    revalidateTag(
      Caching.createUserTag(UserCacheKey.Organizations, parsedInput.targetId)
    );
    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Members,
        ctx.organization.id
      )
    );
    revalidateTag(
      Caching.createUserTag(UserCacheKey.PersonalDetails, parsedInput.targetId)
    );
  });
