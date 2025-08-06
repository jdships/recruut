import * as React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';
import { validate as uuidValidate } from 'uuid';

import { db, eq } from '@workspace/database/client';
import { changeEmailRequestTable } from '@workspace/database/schema';

import { changeEmail } from '~/actions/account/change-email';
import { ChangeEmailSuccessCard } from '~/components/auth/change-email/change-email-success-card';
import { createTitle } from '~/lib/formatters';

const paramsCache = createSearchParamsCache({
  requestId: parseAsString.withDefault('')
});

export const metadata: Metadata = {
  title: createTitle('Change email')
};

export default async function ChangeEmailPage({
  params
}: NextPageProps): Promise<React.JSX.Element> {
  const { requestId } = await paramsCache.parse(params);
  if (!requestId || !uuidValidate(requestId)) {
    return notFound();
  }

  const [changeEmailRequest] = await db
    .select({
      email: changeEmailRequestTable.email
    })
    .from(changeEmailRequestTable)
    .where(eq(changeEmailRequestTable.id, requestId))
    .limit(1);

  if (!changeEmailRequest) {
    return notFound();
  }

  await changeEmail({ id: requestId });

  return <ChangeEmailSuccessCard email={changeEmailRequest.email} />;
}
