'use server';

import { createHash } from 'crypto';
import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { decodeBase64Image, resizeImage } from '@workspace/common/image';
import type { Maybe } from '@workspace/common/maybe';
import { and, db, eq } from '@workspace/database/client';
import { contactImageTable, contactTable } from '@workspace/database/schema';
import { getContactImageUrl } from '@workspace/routes';

import { updateContactAndCaptureEvent } from '~/actions/contacts/_contact-event-capture';
import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { FileUploadAction } from '~/lib/file-upload';
import { updateContactImageSchema } from '~/schemas/contacts/update-contact-image-schema';

export const updateContactImage = authOrganizationActionClient
  .metadata({ actionName: 'updateContactImage' })
  .inputSchema(updateContactImageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [contact] = await db
      .select({})
      .from(contactTable)
      .where(
        and(
          eq(contactTable.organizationId, ctx.organization.id),
          eq(contactTable.id, parsedInput.id)
        )
      )
      .limit(1);

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    let imageUrl: Maybe<string> = undefined;

    if (parsedInput.action === FileUploadAction.Update && parsedInput.image) {
      const { buffer, mimeType } = decodeBase64Image(parsedInput.image);
      const data = await resizeImage(buffer, mimeType);
      const hash = createHash('sha256').update(data).digest('hex');

      await db.transaction(async (tx) => {
        await tx
          .delete(contactImageTable)
          .where(eq(contactImageTable.contactId, parsedInput.id));

        await tx.insert(contactImageTable).values({
          contactId: parsedInput.id,
          data,
          contentType: mimeType,
          hash
        });
      });

      imageUrl = getContactImageUrl(parsedInput.id, hash);
    }

    if (parsedInput.action === FileUploadAction.Delete) {
      await db
        .delete(contactImageTable)
        .where(eq(contactImageTable.contactId, parsedInput.id));
      imageUrl = null;
    }

    await updateContactAndCaptureEvent(
      parsedInput.id,
      { image: imageUrl },
      ctx.session.user.id
    );

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Contacts,
        ctx.organization.id
      )
    );
    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Contact,
        ctx.organization.id,
        parsedInput.id
      )
    );

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          ctx.organization.id,
          membership.userId
        )
      );
    }
  });
