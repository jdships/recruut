import * as React from 'react';
import { type Metadata } from 'next';

import { session } from '@workspace/auth/session';
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
  title: createTitle('Security')
};

export type SecurityLayoutProps = {
  changePassword: React.ReactNode;
  connectedAccounts: React.ReactNode;
  multiFactorAuthentication: React.ReactNode;
  manageSessions: React.ReactNode;
};

export default function SecurityLayout({
  changePassword,
  connectedAccounts,
  multiFactorAuthentication,
  manageSessions
}: SecurityLayoutProps): React.JSX.Element {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <OrganizationPageTitle
            index={{
              route: routes.dashboard.organizations.slug.settings.account.Index,
              title: 'Account'
            }}
            title="Security"
          />
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <AnnotatedLayout>
          {changePassword}
          <Separator />
          {connectedAccounts}
          <Separator />
          {multiFactorAuthentication}
          {session.strategy === 'database' && (
            <>
              <Separator />
              {manageSessions}
            </>
          )}
        </AnnotatedLayout>
      </PageBody>
    </Page>
  );
}
