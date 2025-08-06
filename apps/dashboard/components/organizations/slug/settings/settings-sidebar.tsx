'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

import { replaceOrgSlug, routes } from '@workspace/routes';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@workspace/ui/components/sidebar';

import { NavAccount } from '~/components/organizations/slug/settings/nav-account';
import { NavOrganization } from '~/components/organizations/slug/settings/nav-organization';
import { useActiveOrganization } from '~/hooks/use-active-organization';

export function SettingsSidebar(): React.JSX.Element {
  const activeOrganization = useActiveOrganization();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex h-14 flex-row items-center py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back"
            >
              <Link
                href={replaceOrgSlug(
                  routes.dashboard.organizations.slug.Home,
                  activeOrganization.slug
                )}
                className="h-10"
              >
                <ChevronLeftIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-semibold">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea
          verticalScrollBar
          className="h-full"
        >
          <NavAccount />
          <NavOrganization />
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
