import * as React from 'react';

import {
  Card,
  CardContent,
  type CardProps
} from '@workspace/ui/components/card';
import { EmptyText } from '@workspace/ui/components/empty-text';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';

import { ConnectedAccountList } from '~/components/organizations/slug/settings/account/security/connected-account-list';
import type { ConnectedAccountDto } from '~/types/dtos/connected-account-dto';

export type ConnectedAccountsCardProps = CardProps & {
  connectedAccounts: ConnectedAccountDto[];
};

export function ConnectedAccountsCard({
  connectedAccounts,
  className,
  ...other
}: ConnectedAccountsCardProps): React.JSX.Element {
  return (
    <Card
      className={cn('flex flex-col p-0', className)}
      {...other}
    >
      <CardContent className="max-h-72 flex-1 overflow-hidden p-0">
        {connectedAccounts.length > 0 ? (
          <ScrollArea className="h-full">
            <ConnectedAccountList connectedAccounts={connectedAccounts} />
          </ScrollArea>
        ) : (
          <EmptyText className="p-6">No connected account found.</EmptyText>
        )}
      </CardContent>
    </Card>
  );
}
