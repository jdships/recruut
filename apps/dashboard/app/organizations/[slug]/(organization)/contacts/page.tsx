import * as React from 'react';
import { type Metadata } from 'next';

import {
  Page,
  PageActions,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageSecondaryBar
} from '@workspace/ui/components/page';

import { AddContactButton } from '~/components/organizations/slug/contacts/add-contact-button';
import { ContactsDataTable } from '~/components/organizations/slug/contacts/contacts-data-table';
import { ContactsEmptyState } from '~/components/organizations/slug/contacts/contacts-empty-state';
import { ContactsFilters } from '~/components/organizations/slug/contacts/contacts-filters';
import { searchParamsCache } from '~/components/organizations/slug/contacts/contacts-search-params';
import { OrganizationPageTitle } from '~/components/organizations/slug/organization-page-title';
import { getContactTags } from '~/data/contacts/get-contact-tags';
import { getContacts } from '~/data/contacts/get-contacts';
import { TransitionProvider } from '~/hooks/use-transition-context';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Contacts')
};

export default async function ContactsPage({
  searchParams
}: NextPageProps): Promise<React.JSX.Element> {
  const parsedSearchParams = await searchParamsCache.parse(searchParams);

  const [{ contacts, filteredCount, totalCount }, tags] = await Promise.all([
    getContacts(parsedSearchParams),
    getContactTags()
  ]);

  const hasAnyContacts = totalCount > 0;

  return (
    <TransitionProvider>
      <Page>
        <PageHeader>
          <PagePrimaryBar>
            <OrganizationPageTitle
              title="Contacts"
              info={`Total ${totalCount} ${totalCount === 1 ? 'contact' : 'contacts'} in your organization`}
            />
            {hasAnyContacts && (
              <PageActions>
                <AddContactButton />
              </PageActions>
            )}
          </PagePrimaryBar>
          <PageSecondaryBar>
            <React.Suspense>
              <ContactsFilters tags={tags} />
            </React.Suspense>
          </PageSecondaryBar>
        </PageHeader>
        <PageBody disableScroll={hasAnyContacts}>
          {hasAnyContacts ? (
            <React.Suspense>
              <ContactsDataTable
                data={contacts}
                totalCount={filteredCount}
              />
            </React.Suspense>
          ) : (
            <ContactsEmptyState />
          )}
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
