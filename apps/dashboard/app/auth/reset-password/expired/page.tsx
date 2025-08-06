import * as React from 'react';
import { type Metadata } from 'next';

import { ResetPasswordExpiredCard } from '~/components/auth/reset-password/reset-password-expired-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Expired change request')
};

export default function ResetPasswordExpiredPage(): React.JSX.Element {
  return <ResetPasswordExpiredCard />;
}
