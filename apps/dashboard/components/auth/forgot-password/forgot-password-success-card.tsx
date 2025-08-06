import * as React from 'react';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';

import { routes } from '@workspace/routes';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

export type ForgotPasswordSuccessCardProps = CardProps & {
  email: string;
};

export function ForgotPasswordSuccessCard({
  email,
  className,
  ...other
}: ForgotPasswordSuccessCardProps): React.JSX.Element {
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
          Reset instructions sent
        </CardTitle>
        <CardDescription>
          An email with a link and reset instructions is on its way to{' '}
          <strong className="text-foreground font-medium">{email}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="info">
          <InfoIcon className="size-[18px] shrink-0" />
          <AlertDescription className="inline">
            If you don't receive an email soon, check that the email address you
            entered is correct, check your spam folder or reach out to support
            if the issue persists.
          </AlertDescription>
        </Alert>
      </CardContent>
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
