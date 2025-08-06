import * as React from 'react';
import Link from 'next/link';

import { routes } from '@workspace/routes';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

export function InvitationAlreadyAcceptedCard({
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
          Invitation was already accepted
        </CardTitle>
        <CardDescription>
          If you feel you've reached this message in error, please talk with
          your team administrator and ask them to reinvite you. In case you have
          an account you can try to{' '}
          <Link
            href={routes.dashboard.auth.SignIn}
            className="text-foreground underline"
          >
            log in
          </Link>{' '}
          instead.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
