'use client';

import * as React from 'react';

import { ResponsiveScrollArea } from '@workspace/ui/components/scroll-area';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { ContactDetailsSection } from '~/components/organizations/slug/contacts/details/contact-details-section';
import { ContactStageSection } from '~/components/organizations/slug/contacts/details/contact-stage-section';
import { ContactTagsSection } from '~/components/organizations/slug/contacts/details/contact-tags-section';
import type { ContactDto } from '~/types/dtos/contact-dto';

export type ContactMetaProps = {
  contact: ContactDto;
};

export function ContactMeta({ contact }: ContactMetaProps): React.JSX.Element {
  return (
    <ResponsiveScrollArea
      breakpoint={MediaQueries.MdUp}
      mediaQueryOptions={{ ssr: true }}
      className="sm:h-full"
    >
      <div className="size-full divide-y border-b md:w-[360px] md:min-w-[360px]">
        <ContactDetailsSection contact={contact} />
        <ContactStageSection contact={contact} />
        <ContactTagsSection contact={contact} />
      </div>
    </ResponsiveScrollArea>
  );
}
