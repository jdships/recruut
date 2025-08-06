'use server';

import { revalidateTag } from 'next/cache';

import { db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateSocialMediaSchema } from '~/schemas/organization/update-social-media-schema';

export const updateSocialMedia = authOrganizationActionClient
  .metadata({ actionName: 'updateSocialMedia' })
  .inputSchema(updateSocialMediaSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(organizationTable)
      .set({
        linkedInProfile: parsedInput.linkedInProfile
          ? parsedInput.linkedInProfile
          : null,
        instagramProfile: parsedInput.instagramProfile
          ? parsedInput.instagramProfile
          : null,
        youTubeChannel: parsedInput.youTubeChannel
          ? parsedInput.youTubeChannel
          : null,
        xProfile: parsedInput.xProfile ? parsedInput.xProfile : null,
        tikTokProfile: parsedInput.tikTokProfile
          ? parsedInput.tikTokProfile
          : null,
        facebookPage: parsedInput.facebookPage ? parsedInput.facebookPage : null
      })
      .where(eq(organizationTable.id, ctx.organization.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.SocialMedia,
        ctx.organization.id
      )
    );
  });
