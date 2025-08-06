import * as React from 'react';
import { type Metadata } from 'next';

import { InvitationAlreadyAcceptedCard } from '~/components/invitations/invitation-already-accepted-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Already accepted')
};

export default function InvitationAlreadyAcceptedPage(): React.JSX.Element {
  return <InvitationAlreadyAcceptedCard />;
}
