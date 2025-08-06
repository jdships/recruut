import * as React from 'react';
import { type Metadata } from 'next';

import { InvitationRevokedCard } from '~/components/invitations/invitation-revoked-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Invitation revoked')
};

export default function InvitationRevokedPage(): React.JSX.Element {
  return <InvitationRevokedCard />;
}
