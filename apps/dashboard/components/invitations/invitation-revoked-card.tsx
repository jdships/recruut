import * as React from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

export function InvitationRevokedCard({
  className,
  ...other
}: CardProps): React.JSX.Element {
  return (
    <Card
      className={cn(
        'w-full px-4 py-8 border-transparent dark:border-border',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">
          Invitation was revoked
        </CardTitle>
        <CardDescription>
          If you feel you've reached this message in error, please talk with
          your team administrator and ask them to reinvite you.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
