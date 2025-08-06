'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { CheckSquare2Icon } from 'lucide-react';

import { ContactTaskStatus } from '@workspace/database/schema';
import { Button } from '@workspace/ui/components/button';
import { EmptyText } from '@workspace/ui/components/empty-text';
import { ResponsiveScrollArea } from '@workspace/ui/components/scroll-area';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { AddContactTaskModal } from '~/components/organizations/slug/contacts/details/tasks/add-contact-task-modal';
import { ContactTaskList } from '~/components/organizations/slug/contacts/details/tasks/contact-task-list';
import type { ContactDto } from '~/types/dtos/contact-dto';
import type { ContactTaskDto } from '~/types/dtos/contact-task-dto';

export type ContactTasksProps = {
  contact: ContactDto;
  tasks: ContactTaskDto[];
};

export function ContactTasks({
  contact,
  tasks
}: ContactTasksProps): React.JSX.Element {
  const openTasks = tasks.filter(
    (task) => task.status === ContactTaskStatus.OPEN
  );
  const completedTasks = tasks.filter(
    (task) => task.status === ContactTaskStatus.COMPLETED
  );
  const handleShowAddTaskModal = (): void => {
    NiceModal.show(AddContactTaskModal, { contactId: contact.id });
  };
  return (
    <ResponsiveScrollArea
      breakpoint={MediaQueries.MdUp}
      mediaQueryOptions={{ ssr: true }}
      className="h-full"
    >
      <div className="divide-y border-b">
        <div className="flex h-14 flex-row items-center justify-between gap-2 px-6">
          <h1 className="text-sm font-semibold">
            All tasks{' '}
            <span className="text-muted-foreground">({tasks.length})</span>
          </h1>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleShowAddTaskModal}
          >
            <CheckSquare2Icon className="size-4 shrink-0" />
            Add task
          </Button>
        </div>
        <Heading>Open</Heading>
        {openTasks.length > 0 ? (
          <ContactTaskList tasks={openTasks} />
        ) : (
          <EmptyText className="p-6">
            There is no open task for this contact.
          </EmptyText>
        )}
        <Heading>Completed</Heading>
        {completedTasks.length > 0 ? (
          <ContactTaskList tasks={completedTasks} />
        ) : (
          <EmptyText className="p-6">
            There is no completed task for this contact.
          </EmptyText>
        )}
      </div>
    </ResponsiveScrollArea>
  );
}

function Heading(props: React.PropsWithChildren): React.JSX.Element {
  return (
    <h4 className="bg-neutral-50 px-6 py-3 text-sm font-medium text-muted-foreground dark:bg-neutral-900">
      {props.children}
    </h4>
  );
}
