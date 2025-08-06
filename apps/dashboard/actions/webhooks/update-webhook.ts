'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { webhookTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { updateWebhookSchema } from '~/schemas/webhooks/update-webhook-schema';

export const updateWebhook = authOrganizationActionClient
  .metadata({ actionName: 'updateWebhook' })
  .inputSchema(updateWebhookSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [webhook] = await db
      .select({})
      .from(webhookTable)
      .where(
        and(
          eq(webhookTable.id, parsedInput.id),
          eq(webhookTable.organizationId, ctx.organization.id)
        )
      )
      .limit(1);

    if (!webhook) {
      throw new NotFoundError('Webhook not found');
    }

    await db
      .update(webhookTable)
      .set({
        url: parsedInput.url,
        triggers: parsedInput.triggers ? parsedInput.triggers : [],
        secret: parsedInput.secret ? parsedInput.secret : null
      })
      .where(eq(webhookTable.id, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Webhooks,
        ctx.organization.id
      )
    );
  });
