import * as React from 'react';

import { ConnectedAccountsCard } from '~/components/organizations/slug/settings/account/security/connected-accounts-card';
import { getConnectedAccounts } from '~/data/account/get-connected-accounts';

export default async function ConnectedAccountsPage(): Promise<React.JSX.Element> {
  const connectedAccounts = await getConnectedAccounts();
  return <ConnectedAccountsCard connectedAccounts={connectedAccounts} />;
}
