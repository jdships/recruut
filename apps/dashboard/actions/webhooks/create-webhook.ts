'use server';

import { revalidateTag } from 'next/cache';

import { db } from '@workspace/database/client';
import { webhookTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { createWebhookSchema } from '~/schemas/webhooks/create-webhook-schema';

export const createWebhook = authOrganizationActionClient
  .metadata({ actionName: 'createWebhook' })
  .inputSchema(createWebhookSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.insert(webhookTable).values({
      organizationId: ctx.organization.id,
      url: parsedInput.url,
      triggers: parsedInput.triggers ? parsedInput.triggers : [],
      secret: parsedInput.secret ? parsedInput.secret : null
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Webhooks,
        ctx.organization.id
      )
    );
  });
