import * as React from 'react';
import { type Metadata } from 'next';

import { ChangeEmailInvalidCard } from '~/components/auth/change-email/change-email-invalid-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Invalid change request')
};

export default function ChangeEmailInvalidPage(): React.JSX.Element {
  return <ChangeEmailInvalidCard />;
}
