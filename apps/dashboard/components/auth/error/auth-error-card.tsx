import * as React from 'react';
import Link from 'next/link';
import { AlertCircleIcon } from 'lucide-react';

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

export type AuthErrorCardProps = CardProps & {
  errorMessage: string;
};

export function AuthErrorCard({
  errorMessage,
  className,
  ...other
}: AuthErrorCardProps): React.JSX.Element {
  return (
    <Card
      className={cn(
        'w-full px-4 py-8 border-transparent dark:border-border',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">Auth Error</CardTitle>
        <CardDescription>
          An error occurred when logging you in. Head back to the sign in screen
          and try again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircleIcon className="size-[18px] shrink-0" />
          <AlertDescription className="inline">{errorMessage}</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <Link
          href={routes.dashboard.auth.SignIn}
          className="text-muted-foreground underline"
        >
          Back to log in
        </Link>
      </CardFooter>
    </Card>
  );
}
