import 'server-only';

import { unstable_cache as cache } from 'next/cache';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { asc, db, eq } from '@workspace/database/client';
import { webhookTable, type WebhookTrigger } from '@workspace/database/schema';

import {
  Caching,
  defaultRevalidateTimeInSeconds,
  OrganizationCacheKey
} from '~/data/caching';
import type { WebhookDto } from '~/types/dtos/webhook-dto';

export async function getWebhooks(): Promise<WebhookDto[]> {
  const ctx = await getAuthOrganizationContext();

  return cache(
    async () => {
      const webhooks = await db
        .select({
          id: webhookTable.id,
          url: webhookTable.url,
          triggers: webhookTable.triggers,
          secret: webhookTable.secret
        })
        .from(webhookTable)
        .where(eq(webhookTable.organizationId, ctx.organization.id))
        .orderBy(asc(webhookTable.createdAt));

      const response: WebhookDto[] = webhooks.map((webhook) => ({
        id: webhook.id,
        url: webhook.url,
        triggers: webhook.triggers as WebhookTrigger[],
        secret: webhook.secret ?? undefined
      }));

      return response;
    },
    Caching.createOrganizationKeyParts(
      OrganizationCacheKey.Webhooks,
      ctx.organization.id
    ),
    {
      revalidate: defaultRevalidateTimeInSeconds,
      tags: [
        Caching.createOrganizationTag(
          OrganizationCacheKey.Webhooks,
          ctx.organization.id
        )
      ]
    }
  )();
}
