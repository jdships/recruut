import * as React from 'react';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';

import { getAuthContext } from '@workspace/auth/context';
import { and, db, eq } from '@workspace/database/client';
import { InvitationStatus, invitationTable } from '@workspace/database/schema';
import { routes } from '@workspace/routes';
import { Logo } from '@workspace/ui/components/logo';

import { OnboardingWizard } from '~/components/onboarding/onboarding-wizard';
import { SignOutButton } from '~/components/onboarding/sign-out-button';
import { createTitle } from '~/lib/formatters';
import { OnboardingStep } from '~/schemas/onboarding/complete-onboarding-schema';

export const metadata: Metadata = {
  title: createTitle('Onboarding')
};

export default async function OnboardingFullPage(): Promise<React.JSX.Element> {
  const ctx = await getAuthContext();
  if (ctx.session.user.completedOnboarding) {
    return redirect(routes.dashboard.organizations.Index);
  }
  if (
    // has memberships
    ctx.session.user.memberships.length > 0 ||
    // pending invitation
    (
      await db
        .select({})
        .from(invitationTable)
        .where(
          and(
            eq(invitationTable.email, ctx.session.user.email),
            eq(invitationTable.status, InvitationStatus.PENDING)
          )
        )
        .limit(1)
    ).length > 0
  ) {
    return redirect(routes.dashboard.onboarding.User);
  }
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-x-0 top-0 mx-auto flex min-w-80 items-center justify-center p-4">
        <Logo />
      </div>
      <SignOutButton
        type="button"
        variant="link"
        className="absolute left-4 top-4"
      >
        <ChevronLeftIcon className="mr-2 size-4 shrink-0" />
        Sign out
      </SignOutButton>
      <OnboardingWizard
        activeSteps={[
          OnboardingStep.Profile,
          OnboardingStep.Theme,
          OnboardingStep.Organization,
          OnboardingStep.InviteTeam
        ]}
        metadata={{ user: ctx.session.user }}
      />
    </div>
  );
}
