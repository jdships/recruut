'use client';

import * as React from 'react';
import {
  OTPInput,
  OTPInputContext,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS
} from 'input-otp';
import { MinusIcon } from 'lucide-react';

import { cn } from '../lib/utils';

export type InputOTPElement = React.ComponentRef<typeof OTPInput>;
export type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
};
function InputOTP({
  className,
  containerClassName,
  ...props
}: InputOTPProps): React.JSX.Element {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

export type InputOTPGroupElement = React.ComponentRef<'div'>;
export type InputOTPGroupProps = React.ComponentProps<'div'>;
function InputOTPGroup({
  className,
  ...props
}: InputOTPGroupProps): React.JSX.Element {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

export type InputOTPSlotElement = React.ComponentRef<'div'>;
export type InputOTPSlotProps = React.ComponentProps<'div'> & { index: number };
function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps): React.JSX.Element {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

export type InputOTPSeparatorElement = React.ComponentRef<'div'>;
export type InputOTPSeparatorProps = React.ComponentProps<'div'>;
function InputOTPSeparator(props: InputOTPSeparatorProps): React.JSX.Element {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  REGEXP_ONLY_DIGITS
};
