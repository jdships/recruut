import * as React from 'react';

import { OrganizationLogoCard } from '~/components/organizations/slug/settings/organization/general/organization-logo-card';
import { getOrganizationLogo } from '~/data/organization/get-organization-logo';

export default async function OrganizationLogoPage(): Promise<React.JSX.Element> {
  const logo = await getOrganizationLogo();
  return <OrganizationLogoCard logo={logo} />;
}
