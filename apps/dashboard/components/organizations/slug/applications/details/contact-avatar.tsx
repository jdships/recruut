import * as React from 'react';
import { BuildingIcon, UserIcon } from 'lucide-react';

import { ContactRecord } from '@workspace/database/schema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps
} from '@workspace/ui/components/avatar';
import { cn } from '@workspace/ui/lib/utils';

export type ContactAvatarProps = AvatarProps & {
  record: ContactRecord;
  src?: string;
  alt?: string;
};

export function ContactAvatar({
  record,
  src,
  alt,
  className,
  ...other
}: ContactAvatarProps): React.JSX.Element {
  return (
    <Avatar
      className={cn(
        'size-4 flex-none shrink-0',
        record === ContactRecord.PERSON && 'rounded-full',
        record === ContactRecord.COMPANY && 'rounded-sm',
        className
      )}
      {...other}
    >
      <AvatarImage
        src={src}
        alt={alt ?? 'avatar'}
      />
      <AvatarFallback>
        {record === ContactRecord.COMPANY ? (
          <BuildingIcon className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <UserIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
