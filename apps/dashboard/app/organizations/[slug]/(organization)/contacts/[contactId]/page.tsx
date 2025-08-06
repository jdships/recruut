import * as React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSearchParamsCache, parseAsString } from 'nuqs/server';

import { routes } from '@workspace/routes';
import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar
} from '@workspace/ui/components/page';

import { ContactActions } from '~/components/organizations/slug/contacts/details/contact-actions';
import { ContactMeta } from '~/components/organizations/slug/contacts/details/contact-meta';
import { ContactPageVisit } from '~/components/organizations/slug/contacts/details/contact-page-visit';
import { ContactTabs } from '~/components/organizations/slug/contacts/details/contact-tabs';
import { OrganizationPageTitle } from '~/components/organizations/slug/organization-page-title';
import { getContact } from '~/data/contacts/get-contact';
import { createTitle } from '~/lib/formatters';

const dedupedGetContact = React.cache(getContact);

const paramsCache = createSearchParamsCache({
  contactId: parseAsString.withDefault('')
});

export async function generateMetadata({
  params
}: NextPageProps): Promise<Metadata> {
  const { contactId } = await paramsCache.parse(params);

  if (contactId) {
    const contact = await dedupedGetContact({
      id: contactId
    });
    if (contact) {
      return {
        title: createTitle(contact.name)
      };
    }
  }

  return {
    title: createTitle('Contact')
  };
}

export default async function ContactPage({
  params
}: NextPageProps): Promise<React.JSX.Element> {
  const { contactId } = await paramsCache.parse(params);
  if (!contactId) {
    return notFound();
  }

  const contact = await dedupedGetContact({
    id: contactId
  });

  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <OrganizationPageTitle
            index={{
              route: routes.dashboard.organizations.slug.Contacts,
              title: 'Contacts'
            }}
            title={contact.name}
          />
          <ContactActions contact={contact} />
        </PagePrimaryBar>
      </PageHeader>
      <PageBody
        disableScroll
        className="flex h-full flex-col overflow-auto md:flex-row md:divide-x md:overflow-hidden"
      >
        <ContactPageVisit contact={contact} />
        <ContactMeta contact={contact} />
        <ContactTabs contact={contact} />
      </PageBody>
    </Page>
  );
}
