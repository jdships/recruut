import * as React from 'react';
import type { Metadata } from 'next';

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
  title: createTitle('Notifications')
};

export type NotificationsLayoutProps = {
  transactionalEmails: React.ReactNode;
  marketingEmails: React.ReactNode;
};

export default function NotificationsLayout({
  transactionalEmails,
  marketingEmails
}: NotificationsLayoutProps): React.JSX.Element {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <OrganizationPageTitle
            index={{
              route: routes.dashboard.organizations.slug.settings.account.Index,
              title: 'Account'
            }}
            title="Notifications"
          />
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <AnnotatedLayout>
          {transactionalEmails}
          <Separator />
          {marketingEmails}
        </AnnotatedLayout>
      </PageBody>
    </Page>
  );
}
