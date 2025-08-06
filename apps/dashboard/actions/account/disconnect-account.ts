'use server';

import { revalidatePath } from 'next/cache';

import { OAuthProvider } from '@workspace/auth/providers.types';
import { APP_NAME } from '@workspace/common/app';
import { NotFoundError } from '@workspace/common/errors';
import { and, db, eq } from '@workspace/database/client';
import { accountTable } from '@workspace/database/schema';
import { sendConnectedAccountSecurityAlertEmail } from '@workspace/email/send-connected-account-security-alert-email';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { identityProviderLabels } from '~/lib/labels';
import { disconnectAccountSchema } from '~/schemas/account/disconnect-account-schema';

export const disconnectAccount = authOrganizationActionClient
  .metadata({ actionName: 'disconnectAccount' })
  .inputSchema(disconnectAccountSchema)
  .action(async ({ parsedInput, ctx }) => {
    const normalizedProvider = parsedInput.provider.toLowerCase();
    const [account] = await db
      .select({
        id: accountTable.id,
        provider: accountTable.provider
      })
      .from(accountTable)
      .where(
        and(
          eq(accountTable.provider, normalizedProvider),
          eq(accountTable.userId, ctx.session.user.id)
        )
      )
      .limit(1);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    await db.delete(accountTable).where(eq(accountTable.id, account.id));

    try {
      await sendConnectedAccountSecurityAlertEmail({
        recipient: ctx.session.user.email,
        appName: APP_NAME,
        name: ctx.session.user.name,
        provider: identityProviderLabels[account.provider as OAuthProvider],
        action: 'disconnected'
      });
    } catch (e) {
      console.error(e);
    }

    revalidatePath(
      replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.account.Security,
        ctx.organization.slug
      )
    );
  });
