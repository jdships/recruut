'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircleIcon, LockIcon } from 'lucide-react';
import { type SubmitHandler } from 'react-hook-form';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardProps
} from '@workspace/ui/components/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormProvider
} from '@workspace/ui/components/form';
import { InputPassword } from '@workspace/ui/components/input-password';
import { cn } from '@workspace/ui/lib/utils';

import { resetPassword } from '~/actions/auth/reset-password';
import { PasswordFormMessage } from '~/components/auth/password-form-message';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  resetPasswordSchema,
  type ResetPasswordSchema
} from '~/schemas/auth/reset-password-schema';

export type ResetPasswordCardProps = CardProps & {
  requestId: string;
  expires: Date;
};

export function ResetPasswordCard({
  requestId,
  expires,
  className,
  ...other
}: ResetPasswordCardProps): React.JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const methods = useZodForm({
    schema: resetPasswordSchema,
    mode: 'onSubmit',
    defaultValues: {
      requestId,
      password: ''
    }
  });
  const password = methods.watch('password');
  const canSubmit = !methods.formState.isSubmitting;
  const onSubmit: SubmitHandler<ResetPasswordSchema> = async (values) => {
    if (!canSubmit) {
      return;
    }
    const result = await resetPassword(values);
    if (result?.serverError || result?.validationErrors) {
      setErrorMessage("Couldn't reset password.");
    }
  };
  return (
    <FormProvider {...methods}>
      <Card
        className={cn(
          'w-full px-4 py-8 border-transparent dark:border-border',
          className
        )}
        {...other}
      >
        <CardHeader>
          <CardTitle className="text-base lg:text-lg">
            Reset your password
          </CardTitle>
          <CardDescription suppressHydrationWarning>
            Use the form below to change your password. This request will expire
            in {expires ? formatDistanceToNow(expires) : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="hidden"
              className="hidden"
              disabled={methods.formState.isSubmitting}
              {...methods.register('requestId')}
            />
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword
                      maxLength={72}
                      autoCapitalize="off"
                      startAdornment={<LockIcon className="size-4 shrink-0" />}
                      disabled={methods.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <PasswordFormMessage password={password} />
                </FormItem>
              )}
            />
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircleIcon className="size-[18px] shrink-0" />
                <AlertDescription className="inline">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              variant="default"
              onClick={methods.handleSubmit(onSubmit)}
            >
              Change password
            </Button>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
