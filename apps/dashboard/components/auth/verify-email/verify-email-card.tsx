'use client';

import * as React from 'react';
import { type SubmitHandler } from 'react-hook-form';

import { Button } from '@workspace/ui/components/button';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS_AND_CHARS
} from '@workspace/ui/components/input-otp';
import { toast } from '@workspace/ui/components/sonner';
import { cn } from '@workspace/ui/lib/utils';

import { resendEmailConfirmation } from '~/actions/auth/resend-email-confirmation';
import { verifyEmailWithOtp } from '~/actions/auth/verify-email-with-otp';
import { useZodForm } from '~/hooks/use-zod-form';
import {
  verifyEmailWithOtpSchema,
  type VerifyEmailWithOtpSchema
} from '~/schemas/auth/verify-email-with-otp-schema';

export type VerifyEmailCardProps = CardProps & {
  email: string;
};

export function VerifyEmailCard({
  email,
  className,
  ...other
}: VerifyEmailCardProps): React.JSX.Element {
  // Resending email
  const [isResendingEmailVerification, setIsResendingEmailVerification] =
    React.useState<boolean>(false);
  const handleResendEmailVerification = async (): Promise<void> => {
    setIsResendingEmailVerification(true);
    const result = await resendEmailConfirmation({ email });
    if (!result?.serverError && !result?.validationErrors) {
      toast.success('Email verification resent');
    } else {
      toast.error("Couldn't resend verification");
    }
    setIsResendingEmailVerification(false);
  };
  // Verify with OTP
  const methods = useZodForm({
    schema: verifyEmailWithOtpSchema,
    mode: 'onSubmit',
    defaultValues: {
      otp: ''
    }
  });
  const canSubmit = !methods.formState.isSubmitting;
  const onSubmit: SubmitHandler<VerifyEmailWithOtpSchema> = async (values) => {
    if (!canSubmit) {
      return;
    }
    const result = await verifyEmailWithOtp(values);
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't verify email");
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
            Please check your email
          </CardTitle>
          <CardDescription>
            Your registration has been successful. We have sent you an email
            with a verification link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <p className="text-sm text-muted-foreground">
              Alternatively you can use the one-time password in the email for
              verification.
            </p>
            <FormField
              control={methods.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col items-center space-y-0">
                  <FormControl>
                    <InputOTP
                      {...field}
                      inputMode="text"
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      disabled={methods.formState.isSubmitting}
                      onComplete={methods.handleSubmit(onSubmit)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              disabled={!canSubmit}
              loading={methods.formState.isSubmitting}
            >
              Verify
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center gap-1 text-sm text-muted-foreground">
          Didn't receive an email?
          <Button
            type="button"
            variant="link"
            className="h-fit px-0.5 py-0 text-foreground underline"
            disabled={
              methods.formState.isSubmitting || isResendingEmailVerification
            }
            onClick={handleResendEmailVerification}
          >
            Resend
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  );
}
