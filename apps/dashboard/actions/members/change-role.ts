'use server';

import { revalidateTag } from 'next/cache';

import { ForbiddenError, NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { membershipTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { changeRoleSchema } from '~/schemas/members/change-role-schema';

export const changeRole = authOrganizationActionClient
  .metadata({ actionName: 'changeRole' })
  .inputSchema(changeRoleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [membership] = await db
      .select({
        isOwner: membershipTable.isOwner
      })
      .from(membershipTable)
      .where(
        and(
          eq(membershipTable.organizationId, ctx.organization.id),
          eq(membershipTable.userId, parsedInput.id)
        )
      )
      .limit(1);

    if (!membership) {
      throw new NotFoundError('Membership not found.');
    }
    if (membership.isOwner) {
      throw new ForbiddenError('Owners have to be admin.');
    }

    await db
      .update(membershipTable)
      .set({ role: parsedInput.role })
      .where(eq(membershipTable.userId, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Members,
        ctx.organization.id
      )
    );
    revalidateTag(
      Caching.createUserTag(UserCacheKey.PersonalDetails, parsedInput.id)
    );
  });
