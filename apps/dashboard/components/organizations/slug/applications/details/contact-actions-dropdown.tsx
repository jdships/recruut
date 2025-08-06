'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';
import { MoreHorizontalIcon } from 'lucide-react';

import { replaceOrgSlug, routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { toast } from '@workspace/ui/components/sonner';

import { addFavorite } from '~/actions/favorites/add-favorite';
import { removeFavorite } from '~/actions/favorites/remove-favorite';
import { DeleteContactModal } from '~/components/organizations/slug/contacts/delete-contact-modal';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';
import type { ContactDto } from '~/types/dtos/contact-dto';

export type ContactActionsDropdownProps = {
  contact: ContactDto;
  addedToFavorites: boolean;
};

export function ContactActionsDropdown({
  contact,
  addedToFavorites
}: ContactActionsDropdownProps): React.JSX.Element {
  const router = useRouter();
  const activeOrganization = useActiveOrganization();
  const copyToClipboard = useCopyToClipboard();
  const handleShowDeleteContactModal = async (): Promise<void> => {
    const deleted: boolean = await NiceModal.show(DeleteContactModal, {
      contact
    });
    if (deleted) {
      router.push(
        replaceOrgSlug(
          routes.dashboard.organizations.slug.Contacts,
          activeOrganization.slug
        )
      );
    }
  };
  const handleCopyContactId = async (): Promise<void> => {
    await copyToClipboard(contact.id);
    toast.success('Copied!');
  };
  const handleCopyPageUrl = async (): Promise<void> => {
    await copyToClipboard(window.location.href);
    toast.success('Copied!');
  };
  const handleAddFavorite = async (): Promise<void> => {
    const result = await addFavorite({ contactId: contact.id });
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't add favorite");
    }
  };
  const handleRemoveFavorite = async (): Promise<void> => {
    const result = await removeFavorite({ contactId: contact.id });
    if (result?.serverError || result?.validationErrors) {
      toast.error("Couldn't remove favorite");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="size-9"
          title="Open menu"
        >
          <MoreHorizontalIcon className="size-4 shrink-0" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleCopyContactId}
        >
          Copy contact ID
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleCopyPageUrl}
        >
          Copy page URL
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {addedToFavorites ? (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleRemoveFavorite}
          >
            Remove favorite
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleAddFavorite}
          >
            Add favorite
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive! cursor-pointer"
          onClick={handleShowDeleteContactModal}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
