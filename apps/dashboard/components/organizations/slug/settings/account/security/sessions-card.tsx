import * as React from 'react';

import {
  Card,
  CardContent,
  type CardProps
} from '@workspace/ui/components/card';
import { EmptyText } from '@workspace/ui/components/empty-text';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';

import { SessionList } from '~/components/organizations/slug/settings/account/security/session-list';
import type { SessionDto } from '~/types/dtos/session-dto';

export type SessionsCardProps = CardProps & {
  sessions: SessionDto[];
};

export function SessionsCard({
  sessions,
  className,
  ...other
}: SessionsCardProps): React.JSX.Element {
  return (
    <Card
      className={cn('flex h-full flex-col p-0', className)}
      {...other}
    >
      <CardContent className="max-h-72 flex-1 overflow-hidden p-0">
        {sessions.length > 0 ? (
          <ScrollArea className="h-full">
            <SessionList sessions={sessions} />
          </ScrollArea>
        ) : (
          <EmptyText className="p-6">No session found.</EmptyText>
        )}
      </CardContent>
    </Card>
  );
}
