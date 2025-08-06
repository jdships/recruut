'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@workspace/ui/components/form';
import { RadioCardItem, RadioCards } from '@workspace/ui/components/radio-card';
import { useTheme } from '@workspace/ui/hooks/use-theme';
import { cn } from '@workspace/ui/lib/utils';

import { NextButton } from '~/components/onboarding/next-button';
import type { OnboardingStepProps } from '~/components/onboarding/onboarding-step-props';
import { ThemeOption } from '~/components/organizations/slug/settings/account/profile/theme-option';
import { type CompleteOnboardingSchema } from '~/schemas/onboarding/complete-onboarding-schema';

export type OnboardingThemeStepProps =
  React.HtmlHTMLAttributes<HTMLDivElement> & OnboardingStepProps;

export function OnboardingThemeStep({
  canNext,
  loading,
  isLastStep,
  handleNext,
  className,
  ...other
}: OnboardingThemeStepProps): React.JSX.Element {
  const { setTheme } = useTheme();
  const methods = useFormContext<CompleteOnboardingSchema>();
  const selectedTheme = methods.watch('themeStep.theme');
  React.useEffect(() => {
    setTheme(selectedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheme]);
  return (
    <div
      className={cn('flex w-full flex-col gap-4', className)}
      {...other}
    >
      <h1 className="text-xl font-semibold leading-none tracking-tight lg:text-2xl">
        Choose your theme
      </h1>
      <p className="text-sm text-muted-foreground lg:text-base">
        Select the theme for the application. You’ll be able to change this
        later.
      </p>
      <FormField
        control={methods.control}
        name="themeStep.theme"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormControl>
              <RadioCards
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row flex-wrap gap-4"
                disabled={methods.formState.isSubmitting}
              >
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <RadioCardItem
                    key={theme}
                    value={theme}
                    className="border-none p-0 hover:bg-transparent data-[state=checked]:bg-transparent"
                    checkClassName="bottom-8 group-data-[state=checked]:text-primary-foreground group-data-[state=checked]:bg-blue-500 group-data-[state=checked]:border-blue-500!"
                  >
                    <ThemeOption theme={theme} />{' '}
                  </RadioCardItem>
                ))}
              </RadioCards>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <NextButton
        loading={loading}
        disabled={!canNext}
        isLastStep={isLastStep}
        onClick={handleNext}
      />
    </div>
  );
}
