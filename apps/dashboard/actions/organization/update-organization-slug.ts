'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';
import { updateOrganizationSlugSchema } from '~/schemas/organization/update-organization-slug-schema';

export const updateOrganizationSlug = authOrganizationActionClient
  .metadata({ actionName: 'updateOrganizationSlug' })
  .inputSchema(updateOrganizationSlugSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (parsedInput.slug !== ctx.organization.slug) {
      await db
        .update(organizationTable)
        .set({ slug: parsedInput.slug })
        .where(eq(organizationTable.id, ctx.organization.id));

      for (const membership of ctx.organization.memberships) {
        revalidateTag(
          Caching.createUserTag(UserCacheKey.Organizations, membership.userId)
        );
      }

      redirect(
        `${replaceOrgSlug(
          routes.dashboard.organizations.slug.settings.organization.General,
          parsedInput.slug
        )}?slugUpdated=true`
      );
    }
  });
