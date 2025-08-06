import * as React from 'react';
import { type Metadata } from 'next';

import { routes } from '@workspace/routes';
import { AnnotatedLayout } from '@workspace/ui/components/annotated';
import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar
} from '@workspace/ui/components/page';
import { Separator } from '@workspace/ui/components/separator';

import { OrganizationPageTitle } from '~/components/organizations/slug/organization-page-title';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Members')
};

export type MembersLayoutProps = {
  team: React.ReactNode;
  invitations: React.ReactNode;
};

export default function MembersLayout({
  team,
  invitations
}: MembersLayoutProps): React.JSX.Element {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <OrganizationPageTitle
            index={{
              route:
                routes.dashboard.organizations.slug.settings.organization.Index,
              title: 'Organization'
            }}
            title="Members"
          />
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <AnnotatedLayout>
          {team}
          <Separator />
          {invitations}
        </AnnotatedLayout>
      </PageBody>
    </Page>
  );
}
