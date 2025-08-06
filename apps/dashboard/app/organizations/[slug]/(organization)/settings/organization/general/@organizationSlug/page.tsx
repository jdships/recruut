import * as React from 'react';

import { getAuthOrganizationContext } from '@workspace/auth/context';

import { OrganizationSlugCard } from '~/components/organizations/slug/settings/organization/general/organization-slug-card';

export default async function OrganizationSlugPage(): Promise<React.JSX.Element> {
  const ctx = await getAuthOrganizationContext();
  return <OrganizationSlugCard slug={ctx.organization.slug} />;
}
