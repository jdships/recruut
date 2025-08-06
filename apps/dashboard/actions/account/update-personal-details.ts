'use server';

import { createHash } from 'crypto';
import { revalidateTag } from 'next/cache';

import { decodeBase64Image, resizeImage } from '@workspace/common/image';
import type { Maybe } from '@workspace/common/maybe';
import { db, eq } from '@workspace/database/client';
import { userImageTable, userTable } from '@workspace/database/schema';
import { getUserImageUrl } from '@workspace/routes';

import { authActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { FileUploadAction } from '~/lib/file-upload';
import { updatePersonalDetailsSchema } from '~/schemas/account/update-personal-details-schema';

export const updatePersonalDetails = authActionClient
  .metadata({ actionName: 'updatePersonalDetails' })
  .inputSchema(updatePersonalDetailsSchema)
  .action(async ({ parsedInput, ctx }) => {
    let imageUrl: Maybe<string> = undefined;

    await db.transaction(async (tx) => {
      if (parsedInput.action === FileUploadAction.Update && parsedInput.image) {
        const { buffer, mimeType } = decodeBase64Image(parsedInput.image);
        const data = await resizeImage(buffer, mimeType);
        const hash = createHash('sha256').update(data).digest('hex');

        // Delete old images
        await tx
          .delete(userImageTable)
          .where(eq(userImageTable.userId, ctx.session.user.id));

        // Insert new image
        await tx.insert(userImageTable).values({
          userId: ctx.session.user.id,
          data,
          contentType: mimeType,
          hash
        });

        imageUrl = getUserImageUrl(ctx.session.user.id, hash);
      }

      if (parsedInput.action === FileUploadAction.Delete) {
        await tx
          .delete(userImageTable)
          .where(eq(userImageTable.userId, ctx.session.user.id));
        imageUrl = null;
      }

      await tx
        .update(userTable)
        .set({
          image: imageUrl,
          name: parsedInput.name,
          phone: parsedInput.phone ? parsedInput.phone : null
        })
        .where(eq(userTable.id, ctx.session.user.id));
    });

    revalidateTag(
      Caching.createUserTag(UserCacheKey.PersonalDetails, ctx.session.user.id)
    );

    for (const membership of ctx.session.user.memberships) {
      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Members,
          membership.organizationId
        )
      );
    }
  });
