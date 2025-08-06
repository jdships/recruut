'use client';

import * as React from 'react';
import { format, isBefore } from 'date-fns';
import { MonitorIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { toast } from '@workspace/ui/components/sonner';
import { cn } from '@workspace/ui/lib/utils';

import { signOutSession } from '~/actions/account/sign-out-session';
import type { SessionDto } from '~/types/dtos/session-dto';

export type SessionListProps = React.HtmlHTMLAttributes<HTMLUListElement> & {
  sessions: SessionDto[];
};

export function SessionList({
  sessions,
  className,
  ...other
}: SessionListProps): React.JSX.Element {
  return (
    <ul
      role="list"
      className={cn('m-0 list-none divide-y p-0', className)}
      {...other}
    >
      {sessions.map((session) => (
        <SessionListItem
          key={session.id}
          session={session}
        />
      ))}
    </ul>
  );
}

type SessionListItemProps = React.HTMLAttributes<HTMLLIElement> & {
  session: SessionDto;
};

function SessionListItem({
  session,
  className,
  ...other
}: SessionListItemProps): React.JSX.Element {
  const handleSignOutSession = async () => {
    const result = await signOutSession({ sessionToken: session.id });
    if (!result?.serverError && !result?.validationErrors) {
      toast.success('Session signed out');
    } else {
      toast.error("Couldn't sign out session");
    }
  };
  return (
    <li
      className={cn(
        'flex flex-row items-center justify-between p-6',
        className
      )}
      {...other}
    >
      <div className="flex flex-row items-center gap-4">
        <MonitorIcon className="size-5 shrink-0 text-muted-foreground" />
        <div>
          <h5 className="text-sm font-medium">
            {session.isCurrent ? 'Current session' : 'Other session'}
          </h5>
          <p className="text-sm text-muted-foreground">
            {isBefore(session.expires, new Date())
              ? 'Expired'
              : `Expires on ${format(session.expires, 'dd MMM yyyy')}`}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleSignOutSession}
      >
        Sign out
      </Button>
    </li>
  );
}
