import * as React from 'react';
import { type Metadata } from 'next';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { ForgotPasswordSuccessCard } from '~/components/auth/forgot-password/forgot-password-success-card';
import { createTitle } from '~/lib/formatters';

const searchParamsCache = createSearchParamsCache({
  email: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Reset link sent')
};

export default async function ForgotPasswordSuccessPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const { email } = await searchParamsCache.parse(searchParams);
  return <ForgotPasswordSuccessCard email={email} />;
}
