'use server';

import { revalidateTag } from 'next/cache';

import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { webhookTable } from '@workspace/database/schema';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteWebhookSchema } from '~/schemas/webhooks/delete-webhook-schema';

export const deleteWebhook = authOrganizationActionClient
  .metadata({ actionName: 'deleteWebhook' })
  .inputSchema(deleteWebhookSchema)
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

    await db.delete(webhookTable).where(eq(webhookTable.id, parsedInput.id));

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Webhooks,
        ctx.organization.id
      )
    );
  });
