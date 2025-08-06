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

export function ResetPasswordExpiredCard({
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
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">
          Reset request is expired
        </CardTitle>
        <CardDescription>
          Go back and enter the email associated with your account and we will
          send you another link with instructions to reset your password.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center text-sm">
        <Link
          href={routes.dashboard.auth.forgetPassword.Index}
          className="text-foreground underline"
        >
          Want to try again?
        </Link>
      </CardFooter>
    </Card>
  );
}
