import * as React from 'react';

import { DeleteOrganizationCard } from '~/components/organizations/slug/settings/organization/general/delete-organization-card';
import { getProfile } from '~/data/account/get-profile';

export default async function DangerZonePage(): Promise<React.JSX.Element> {
  const profile = await getProfile();
  return <DeleteOrganizationCard profile={profile} />;
}
