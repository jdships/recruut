import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { Step } from '~/components/onboarding/step';
import { OnboardingStep } from '~/schemas/onboarding/complete-onboarding-schema';

export type StepIndicatorProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  steps: OnboardingStep[];
  currentStep: OnboardingStep;
  setCurrentStep: (value: OnboardingStep) => void;
};

export function StepIndicator({
  steps,
  currentStep,
  setCurrentStep,
  className,
  ...other
}: StepIndicatorProps): React.JSX.Element {
  const currentStepIndex = steps.findIndex((step) => step === currentStep);
  return (
    <div
      className={cn('flex flex-row gap-2', className)}
      {...other}
    >
      {steps.map((step) => {
        const stepIndex = steps.findIndex((s) => s === step);
        const active = stepIndex <= currentStepIndex;
        const disabled = !active || currentStepIndex === stepIndex;
        return (
          <Step
            key={stepIndex}
            step={step}
            active={active}
            disabled={disabled}
            setCurrentStep={setCurrentStep}
          />
        );
      })}
    </div>
  );
}
