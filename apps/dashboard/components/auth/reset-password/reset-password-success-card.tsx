import * as React from 'react';
import Link from 'next/link';

import { routes } from '@workspace/routes';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

export function ResetPasswordSuccessCard({
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
        <CardTitle className="text-base lg:text-lg">Password updated</CardTitle>
        <CardDescription>
          Your password has been successfully changed. Use your new password to
          log in.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center text-sm">
        <Link
          href={routes.dashboard.auth.SignIn}
          className="text-foreground underline"
        >
          Back to log in
        </Link>
      </CardFooter>
    </Card>
  );
}
