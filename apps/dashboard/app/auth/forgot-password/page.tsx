import * as React from 'react';
import { type Metadata } from 'next';

import { ForgotPasswordCard } from '~/components/auth/forgot-password/forgot-password-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Forgot password')
};

export default function ForgotPasswordPage(): React.JSX.Element {
  return <ForgotPasswordCard />;
}
