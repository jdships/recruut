'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { MoreHorizontalIcon } from 'lucide-react';

import { Role } from '@workspace/database/schema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@workspace/ui/lib/utils';

import { ChangeRoleModal } from '~/components/organizations/slug/settings/organization/members/change-role-modal';
import { RemoveMemberModal } from '~/components/organizations/slug/settings/organization/members/remove-member-modal';
import { TransferOwnershipModal } from '~/components/organizations/slug/settings/organization/members/transfer-ownership-modal';
import { capitalize, getInitials } from '~/lib/formatters';
import type { MemberDto } from '~/types/dtos/member-dto';
import type { ProfileDto } from '~/types/dtos/profile-dto';

export type MemberListProps = React.HtmlHTMLAttributes<HTMLUListElement> & {
  profile: ProfileDto;
  members: MemberDto[];
};

export function MemberList({
  profile,
  members,
  className,
  ...other
}: MemberListProps): React.JSX.Element {
  return (
    <ul
      role="list"
      className={cn('m-0 list-none divide-y p-0', className)}
      {...other}
    >
      {members.map((member) => (
        <MemberListItem
          key={member.id}
          profile={profile}
          member={member}
        />
      ))}
    </ul>
  );
}

type MemberListItemProps = React.HtmlHTMLAttributes<HTMLLIElement> & {
  profile: ProfileDto;
  member: MemberDto;
};

function MemberListItem({
  profile,
  member,
  className,
  ...other
}: MemberListItemProps): React.JSX.Element {
  const handleShowChangeRoleModal = (): void => {
    NiceModal.show(ChangeRoleModal, { profile, member });
  };
  const handleShowTransferOwnershipModal = (): void => {
    NiceModal.show(TransferOwnershipModal, { member });
  };
  const handleShowRemoveMemberModal = (): void => {
    NiceModal.show(RemoveMemberModal, { profile, member });
  };
  return (
    <li
      role="listitem"
      className={cn('flex w-full flex-row justify-between p-6', className)}
      {...other}
    >
      <div className="flex flex-row items-center gap-4">
        <Avatar className="size-8">
          <AvatarImage
            src={member.image}
            alt={member.name}
          />
          <AvatarFallback className="rounded-full text-xs">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-sm font-medium">{member.name}</div>
          <div className="text-xs font-normal text-muted-foreground">
            {member.email}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {member.isOwner && (
          <Badge
            variant="secondary"
            className="hidden rounded-3xl sm:inline-block"
          >
            Owner
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="hidden rounded-3xl sm:inline-block"
        >
          {capitalize(member.role.toLowerCase())}
        </Badge>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 p-0"
              title="Open menu"
            >
              <MoreHorizontalIcon className="size-4 shrink-0" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={profile.role !== Role.ADMIN || member.isOwner}
              onClick={handleShowChangeRoleModal}
            >
              Change role
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleShowTransferOwnershipModal}
              disabled={
                !profile.isOwner || member.role !== Role.ADMIN || member.isOwner
              }
            >
              Transfer ownership
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive! cursor-pointer"
              onClick={handleShowRemoveMemberModal}
            >
              {profile.id === member.id
                ? 'Leave organization'
                : 'Remove member'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
