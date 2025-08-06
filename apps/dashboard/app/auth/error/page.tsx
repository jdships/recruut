import * as React from 'react';
import { type Metadata } from 'next';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { AuthErrorCode } from '@workspace/auth/errors';

import { AuthErrorCard } from '~/components/auth/error/auth-error-card';
import { createTitle } from '~/lib/formatters';
import { authErrorLabels } from '~/lib/labels';

const searchParamsCache = createSearchParamsCache({
  error: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Auth Error')
};

export default async function AuthErrorPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const { error } = await searchParamsCache.parse(searchParams);

  const errorMessage =
    error in authErrorLabels
      ? authErrorLabels[error as AuthErrorCode]
      : authErrorLabels[AuthErrorCode.UnknownError];
  return <AuthErrorCard errorMessage={errorMessage} />;
}
