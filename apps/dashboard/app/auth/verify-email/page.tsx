import * as React from 'react';
import { type Metadata } from 'next';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { VerifyEmailCard } from '~/components/auth/verify-email/verify-email-card';
import { createTitle } from '~/lib/formatters';

const searchParamsCache = createSearchParamsCache({
  email: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Verify Email')
};

export default async function VerifyEmailPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const { email } = await searchParamsCache.parse(searchParams);
  return <VerifyEmailCard email={email} />;
}
