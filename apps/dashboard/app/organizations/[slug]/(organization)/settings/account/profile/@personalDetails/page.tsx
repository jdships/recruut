import * as React from 'react';

import { PersonalDetailsCard } from '~/components/organizations/slug/settings/account/profile/personal-details-card';
import { getPersonalDetails } from '~/data/account/get-personal-details';

export default async function PersonalDetailsPage(): Promise<React.JSX.Element> {
  const details = await getPersonalDetails();
  return <PersonalDetailsCard details={details} />;
}
