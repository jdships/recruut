import 'server-only';

import { getAuthContext } from '@workspace/auth/context';
import { providers } from '@workspace/auth/providers';
import { OAuthProvider } from '@workspace/auth/providers.types';
import { and, db, eq, or } from '@workspace/database/client';
import { accountTable } from '@workspace/database/schema';

import type { ConnectedAccountDto } from '~/types/dtos/connected-account-dto';

export async function getConnectedAccounts(): Promise<ConnectedAccountDto[]> {
  const ctx = await getAuthContext();

  const linked = await db
    .select({
      provider: accountTable.provider
    })
    .from(accountTable)
    .where(
      and(
        or(eq(accountTable.type, 'oauth'), eq(accountTable.type, 'oidc')),
        eq(accountTable.userId, ctx.session.user.id)
      )
    );
  const linkedIds = linked.map((a) => a.provider);

  const connectedAccounts: ConnectedAccountDto[] = providers
    .filter((p) => p.type === 'oauth' || p.type === 'oidc')
    .map((p) => ({
      id: p.id as OAuthProvider,
      name: p.name,
      type: p.type,
      linked: linkedIds.includes(p.id)
    }));

  return connectedAccounts;
}
