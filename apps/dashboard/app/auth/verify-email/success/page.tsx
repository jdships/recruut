import * as React from 'react';
import { type Metadata } from 'next';

import { VerifyEmailSuccessCard } from '~/components/auth/verify-email/verify-email-success-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Email Verification Success')
};

export default async function EmailVerificationSuccessPage(): Promise<React.JSX.Element> {
  return <VerifyEmailSuccessCard />;
}
