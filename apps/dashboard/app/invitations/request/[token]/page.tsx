import * as React from 'react';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';
import { validate as uuidValidate } from 'uuid';

import { dedupedAuth } from '@workspace/auth';
import { db, eq } from '@workspace/database/client';
import {
  InvitationStatus,
  invitationTable,
  organizationTable
} from '@workspace/database/schema';
import { routes } from '@workspace/routes';

import { AcceptInvitationCard } from '~/components/invitations/accept-invitation-card';
import { SignInToAcceptCard } from '~/components/invitations/sign-in-to-accept-card';
import { createTitle } from '~/lib/formatters';

const paramsCache = createSearchParamsCache({
  token: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Join organization')
};

export default async function InvitationPage({
  params
}: NextPageProps): Promise<React.JSX.Element> {
  const { token } = await paramsCache.parse(params);
  if (!token || !uuidValidate(token)) {
    return notFound();
  }

  const [invitation] = await db
    .select({
      id: invitationTable.id,
      email: invitationTable.email,
      status: invitationTable.status,
      organization: {
        id: organizationTable.id,
        name: organizationTable.name
      }
    })
    .from(invitationTable)
    .innerJoin(
      organizationTable,
      eq(invitationTable.organizationId, organizationTable.id)
    )
    .where(eq(invitationTable.token, token))
    .limit(1);

  if (!invitation) {
    return notFound();
  }
  if (invitation.status === InvitationStatus.ACCEPTED) {
    return redirect(routes.dashboard.invitations.AlreadyAccepted);
  }
  if (invitation.status === InvitationStatus.REVOKED) {
    return redirect(routes.dashboard.invitations.Revoked);
  }

  const session = await dedupedAuth();
  if (!session || !session.user || session.user.email !== invitation.email) {
    return (
      <SignInToAcceptCard
        organizationName={invitation.organization.name}
        email={invitation.email}
        loggedIn={!!session}
      />
    );
  }
  return (
    <AcceptInvitationCard
      invitationId={invitation.id}
      organizationName={invitation.organization.name}
    />
  );
}
