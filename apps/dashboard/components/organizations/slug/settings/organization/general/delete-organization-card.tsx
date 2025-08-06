'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { DeleteOrganizationModal } from '~/components/organizations/slug/settings/organization/general/delete-organization-modal';
import type { ProfileDto } from '~/types/dtos/profile-dto';

export type DeleteOrganizationCardProps = CardProps & {
  profile: ProfileDto;
};

export function DeleteOrganizationCard({
  profile,
  className,
  ...other
}: DeleteOrganizationCardProps): React.JSX.Element {
  const handleShowDeleteOrganizationModal = (): void => {
    NiceModal.show(DeleteOrganizationModal);
  };
  return (
    <Card
      className={cn('border-destructive', className)}
      {...other}
    >
      <CardContent>
        <p className="text-sm font-normal text-muted-foreground">
          Deleting your organization is irreversible. All the data will be
          permanently removed from our servers.
        </p>
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end">
        <Button
          type="button"
          variant="destructive"
          size="default"
          disabled={!profile.isOwner}
          onClick={handleShowDeleteOrganizationModal}
        >
          Delete organization
        </Button>
      </CardFooter>
    </Card>
  );
}
