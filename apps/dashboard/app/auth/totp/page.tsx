import * as React from 'react';
import { type Metadata } from 'next';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { TotpCodeCard } from '~/components/auth/totp/totp-code-card';
import { createTitle } from '~/lib/formatters';

const searchParamsCache = createSearchParamsCache({
  token: parseAsString.withDefault(''),
  expiry: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Confirm via authenticator app')
};

export default async function TotpPage({
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
    <TotpCodeCard
      token={token}
      expiry={expiry}
    />
  );
}
