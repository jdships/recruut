import * as React from 'react';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';

import { getAuthContext } from '@workspace/auth/context';
import { and, db, eq, sql } from '@workspace/database/client';
import {
  InvitationStatus,
  invitationTable,
  membershipTable,
  organizationTable
} from '@workspace/database/schema';
import { routes } from '@workspace/routes';
import { Logo } from '@workspace/ui/components/logo';

import { OnboardingWizard } from '~/components/onboarding/onboarding-wizard';
import { SignOutButton } from '~/components/onboarding/sign-out-button';
import { createTitle } from '~/lib/formatters';
import { OnboardingStep } from '~/schemas/onboarding/complete-onboarding-schema';

export const metadata: Metadata = {
  title: createTitle('Onboarding')
};

export default async function OnboardingOnlyUserPage(): Promise<React.JSX.Element> {
  const ctx = await getAuthContext();
  if (ctx.session.user.completedOnboarding) {
    return redirect(routes.dashboard.organizations.Index);
  }
  const invitations = await db
    .select({
      id: invitationTable.id,
      organization: {
        logo: organizationTable.logo,
        name: organizationTable.name,
        slug: organizationTable.slug,
        membershipsCount:
          sql<number>`(SELECT COUNT(*) FROM ${membershipTable} WHERE ${membershipTable.organizationId} = ${organizationTable.id})`.mapWith(
            Number
          )
      }
    })
    .from(invitationTable)
    .innerJoin(
      organizationTable,
      eq(invitationTable.organizationId, organizationTable.id)
    )
    .where(
      and(
        eq(invitationTable.email, ctx.session.user.email),
        eq(invitationTable.status, InvitationStatus.PENDING)
      )
    );
  const activeSteps = [OnboardingStep.Profile, OnboardingStep.Theme];
  if (invitations.length > 0) {
    activeSteps.push(OnboardingStep.PendingInvitations);
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
        activeSteps={activeSteps}
        metadata={{
          user: ctx.session.user,
          invitations: invitations.map((invitation) => ({
            id: invitation.id,
            organization: {
              logo: invitation.organization.logo ?? undefined,
              name: invitation.organization.name,
              slug: invitation.organization.slug,
              memberCount: invitation.organization.membershipsCount
            }
          }))
        }}
      />
    </div>
  );
}
