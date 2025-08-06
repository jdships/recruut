import * as React from 'react';
import Link from 'next/link';

import { routes } from '@workspace/routes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

export type ChangeEmailSuccessCardProps = CardProps & {
  email: string;
};

export function ChangeEmailSuccessCard({
  email,
  className,
  ...other
}: ChangeEmailSuccessCardProps): React.JSX.Element {
  return (
    <Card
      className={cn(
        'w-full px-4 py-8 border-transparent dark:border-border',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">Email changed</CardTitle>
        <CardDescription>
          Your email has been successfully changed to{' '}
          <strong className="text-foreground font-medium">{email}</strong>. As a
          result, you've been logged out and must log back in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground">
          <Link
            href={routes.dashboard.auth.SignIn}
            className="text-foreground underline"
          >
            Go to log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
