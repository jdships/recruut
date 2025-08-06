'use server';

import { createHash } from 'crypto';
import { revalidateTag } from 'next/cache';

import { decodeBase64Image, resizeImage } from '@workspace/common/image';
import type { Maybe } from '@workspace/common/maybe';
import { db, eq } from '@workspace/database/client';
import {
  organizationLogoTable,
  organizationTable
} from '@workspace/database/schema';
import { getOrganizationLogoUrl } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { FileUploadAction } from '~/lib/file-upload';
import { updateOrganizationLogoSchema } from '~/schemas/organization/update-organization-logo-schema';

export const updateOrganizationLogo = authOrganizationActionClient
  .metadata({ actionName: 'updateOrganizationLogo' })
  .inputSchema(updateOrganizationLogoSchema)
  .action(async ({ parsedInput, ctx }) => {
    let logoUrl: Maybe<string> = undefined;

    if (parsedInput.action === FileUploadAction.Update && parsedInput.logo) {
      const { buffer, mimeType } = decodeBase64Image(parsedInput.logo);
      const data = await resizeImage(buffer, mimeType);
      const hash = createHash('sha256').update(data).digest('hex');

      await db.transaction(async (tx) => {
        await tx
          .delete(organizationLogoTable)
          .where(eq(organizationLogoTable.organizationId, ctx.organization.id));

        await tx.insert(organizationLogoTable).values({
          organizationId: ctx.organization.id,
          data,
          contentType: mimeType,
          hash
        });
      });

      logoUrl = getOrganizationLogoUrl(ctx.organization.id, hash);
    }

    if (parsedInput.action === FileUploadAction.Delete) {
      await db
        .delete(organizationLogoTable)
        .where(eq(organizationLogoTable.organizationId, ctx.organization.id));
      logoUrl = null;
    }

    await db
      .update(organizationTable)
      .set({ logo: logoUrl })
      .where(eq(organizationTable.id, ctx.organization.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.OrganizationLogo,
        ctx.organization.id
      )
    );

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createUserTag(UserCacheKey.Organizations, membership.userId)
      );
    }
  });
