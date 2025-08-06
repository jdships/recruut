import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { SocialMediaDto } from '~/types/dtos/social-media-dto';

export async function getSocialMedia(): Promise<SocialMediaDto> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const [organization] = await db
        .select({
          linkedInProfile: organizationTable.linkedInProfile,
          youTubeChannel: organizationTable.youTubeChannel,
          instagramProfile: organizationTable.instagramProfile,
          xProfile: organizationTable.xProfile,
          tikTokProfile: organizationTable.tikTokProfile,
          facebookPage: organizationTable.facebookPage
        })
        .from(organizationTable)
        .where(eq(organizationTable.id, ctx.organization.id))
        .limit(1);

      if (!organization) {
        throw new NotFoundError('Organization not found');
      }

      const response: SocialMediaDto = {
        linkedInProfile: organization.linkedInProfile
          ? organization.linkedInProfile
          : undefined,
        instagramProfile: organization.instagramProfile
          ? organization.instagramProfile
          : undefined,
        youTubeChannel: organization.youTubeChannel
          ? organization.youTubeChannel
          : undefined,
        xProfile: organization.xProfile ? organization.xProfile : undefined,
        tikTokProfile: organization.tikTokProfile
          ? organization.tikTokProfile
          : undefined,
        facebookPage: organization.facebookPage
          ? organization.facebookPage
          : undefined
      };

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.SocialMedia,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.SocialMedia,
          ctx.organization.id
        )
      ]
    }
  )();
}
