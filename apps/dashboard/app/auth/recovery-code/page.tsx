import * as React from 'react';
import { type Metadata } from 'next';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { RecoveryCodeCard } from '~/components/auth/recovery-code/recovery-code-card';
import { createTitle } from '~/lib/formatters';

const searchParamsCache = createSearchParamsCache({
  token: parseAsString.withDefault(''),
  expiry: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Recovery code')
};

export default async function RecoveryCodePage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const { token, expiry } = await searchParamsCache.parse(searchParams);

  if (!token) {
    return <>Missing token param.</>;
  }
  if (!expiry) {
    return <>Missing expiry param.</>;
  }

  return (
    <RecoveryCodeCard
      token={token}
      expiry={expiry}
    />
  );
}
