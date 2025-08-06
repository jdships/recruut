'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { FilePlus2Icon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { EmptyText } from '@workspace/ui/components/empty-text';
import { ResponsiveScrollArea } from '@workspace/ui/components/scroll-area';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { AddContactNoteModal } from '~/components/organizations/slug/contacts/details/notes/add-contact-note-modal';
import { ContactNoteCard } from '~/components/organizations/slug/contacts/details/notes/contact-note-card';
import type { ContactDto } from '~/types/dtos/contact-dto';
import type { ContactNoteDto } from '~/types/dtos/contact-note-dto';

export type ContactNotesProps = {
  contact: ContactDto;
  notes: ContactNoteDto[];
};

export function ContactNotes({
  contact,
  notes
}: ContactNotesProps): React.JSX.Element {
  const handleShowAddContactNoteModal = async (): Promise<void> => {
    NiceModal.show(AddContactNoteModal, { contactId: contact.id });
  };
  return (
    <ResponsiveScrollArea
      breakpoint={MediaQueries.MdUp}
      mediaQueryOptions={{ ssr: true }}
      className="h-full"
    >
      <div className="flex h-14 flex-row items-center justify-between gap-2 px-6">
        <h1 className="text-sm font-semibold">
          All notes{' '}
          <span className="text-muted-foreground">({notes.length})</span>
        </h1>
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleShowAddContactNoteModal}
        >
          <FilePlus2Icon className="size-4 shrink-0" />
          Add note
        </Button>
      </div>
      <div className="h-full p-6 pt-0">
        {notes.length > 0 ? (
          <div className="grid size-full grid-cols-1 gap-12 sm:grid-cols-2 2xl:grid-cols-3">
            {notes.map((note) => (
              <ContactNoteCard
                key={note.id}
                note={note}
                className="h-[300px]"
              />
            ))}
          </div>
        ) : (
          <EmptyText>
            There are no associated notes with this contact.
          </EmptyText>
        )}
      </div>
    </ResponsiveScrollArea>
  );
}
