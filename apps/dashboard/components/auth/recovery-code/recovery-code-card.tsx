'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertCircleIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { AuthErrorCode } from '@workspace/auth/errors';
import {
  submitRecoveryCodeSchema,
  type SubmitRecoveryCodeSchema
} from '@workspace/auth/schemas';
import { routes } from '@workspace/routes';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button, buttonVariants } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormProvider
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { submitRecoveryCode } from '~/actions/auth/submit-recovery-code';
import { useZodForm } from '~/hooks/use-zod-form';
import { authErrorLabels } from '~/lib/labels';

export type RecoveryCodeCardProps = CardProps & {
  token: string;
  expiry: string;
};

export function RecoveryCodeCard({
  token,
  expiry,
  className,
  ...other
}: RecoveryCodeCardProps): React.JSX.Element {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorCode, setErrorCode] = React.useState<AuthErrorCode>();
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const methods = useZodForm({
    schema: submitRecoveryCodeSchema,
    mode: 'onSubmit',
    defaultValues: {
      token,
      expiry,
      recoveryCode: ''
    }
  });
  const canSubmit = !isLoading && !methods.formState.isSubmitting;
  const onSubmit = async (values: SubmitRecoveryCodeSchema): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setIsLoading(true);

    const result = await submitRecoveryCode(values);

    if (result?.validationErrors?._errors) {
      const errorCode = result.validationErrors._errors[0] as AuthErrorCode;
      setErrorCode(errorCode);
      setErrorMessage(
        authErrorLabels[
          errorCode in authErrorLabels ? errorCode : AuthErrorCode.UnknownError
        ]
      );

      setIsLoading(false);
    } else if (result?.serverError) {
      setErrorCode(undefined);
      setErrorMessage(result.serverError);
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        'w-full px-4 py-8 border-transparent dark:border-border',
        className
      )}
      {...other}
    >
      <CardHeader>
        <CardTitle className="text-base lg:text-lg">Recovery code</CardTitle>
        <CardDescription>
          Each recovery code can be used exactly once to grant access without
          your authenticator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <input
              type="hidden"
              className="hidden"
              disabled={methods.formState.isSubmitting}
              {...methods.register('token')}
            />
            <FormField
              control={methods.control}
              name="recoveryCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={methods.formState.isSubmitting}
                      placeholder="XXXXX-XXXXX"
                      maxLength={11}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircleIcon className="size-[18px] shrink-0" />
                <AlertDescription className="inline">
                  {errorMessage}
                  {errorCode === AuthErrorCode.RequestExpired && (
                    <Link
                      href={routes.dashboard.auth.SignIn}
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'ml-0.5 h-fit gap-0.5 px-0.5 py-0 text-foreground underline'
                      )}
                    >
                      Sign in again.
                      <ArrowRightIcon className="size-3 shrink-0" />
                    </Link>
                  )}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={!canSubmit}
              loading={methods.formState.isSubmitting}
              onClick={methods.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-center py-2">
        <Link
          href={`${routes.dashboard.auth.Totp}?token=${encodeURIComponent(token)}&expiry=${encodeURIComponent(expiry)}`}
          className={cn(
            buttonVariants({ variant: 'link', size: 'default' }),
            'text-muted-foreground hover:text-primary hover:no-underline'
          )}
        >
          <ArrowLeftIcon className="mr-2 size-4 shrink-0" />
          Go back
        </Link>
      </CardFooter>
    </Card>
  );
}
