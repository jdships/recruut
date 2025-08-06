import * as React from 'react';

import { OrganizationDetailsCard } from '~/components/organizations/slug/settings/organization/general/organization-details-card';
import { getOrganizationDetails } from '~/data/organization/get-organization-details';

export default async function OrganizationDetailsPage(): Promise<React.JSX.Element> {
  const details = await getOrganizationDetails();
  return <OrganizationDetailsCard details={details} />;
}
