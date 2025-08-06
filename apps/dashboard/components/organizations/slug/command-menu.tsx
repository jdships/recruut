'use client';

import { useRouter } from 'next/navigation';
import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@workspace/ui/components/command';

import {
  createAccountNavItems,
  createMainNavItems,
  createOrganizationNavItems
} from '~/components/organizations/slug/nav-items';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

export type CommandMenuProps = NiceModalHocProps;

export const CommandMenu = NiceModal.create<CommandMenuProps>(() => {
  const modal = useEnhancedModal();
  const router = useRouter();
  const activeOrganization = useActiveOrganization();
  const navigationGroups = [
    {
      heading: 'Main Navigation',
      items: createMainNavItems(activeOrganization.slug)
    },
    {
      heading: 'Account',
      items: createAccountNavItems(activeOrganization.slug)
    },
    {
      heading: 'Organization',
      items: createOrganizationNavItems(activeOrganization.slug)
    }
  ];
  return (
    <CommandDialog
      open={modal.visible}
      onOpenChange={modal.handleOpenChange}
      className="max-w-lg"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {navigationGroups.map((group) => (
          <CommandGroup
            key={group.heading}
            heading={group.heading}
          >
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  router.push(item.href);
                  modal.handleClose();
                }}
              >
                <item.icon className="mr-2 h-4! w-4! shrink-0 text-muted-foreground" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
});
