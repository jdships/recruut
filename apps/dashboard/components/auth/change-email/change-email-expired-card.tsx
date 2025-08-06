import * as React from 'react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

export function ChangeEmailExpiredCard({
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
          Change request is expired
        </CardTitle>
        <CardDescription>
          Sorry, your change email request is already expired! You need to
          request an email change again.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
