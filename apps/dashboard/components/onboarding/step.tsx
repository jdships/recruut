'use client';

import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { OnboardingStep } from '~/schemas/onboarding/complete-onboarding-schema';

export type StepProps = React.HtmlHTMLAttributes<HTMLButtonElement> & {
  step: OnboardingStep;
  active: boolean;
  disabled: boolean;
  setCurrentStep: (value: OnboardingStep) => void;
};

export function Step({
  step,
  active,
  disabled,
  setCurrentStep,
  className,
  ...other
}: StepProps): React.JSX.Element {
  const navigate = (): void => {
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };
  return (
    <button
      className={cn(
        'h-1 w-full rounded-[1px]',
        active ? 'bg-primary' : 'bg-muted',
        className
      )}
      type="button"
      tabIndex={-1}
      disabled={disabled}
      onClick={navigate}
      {...other}
    />
  );
}
