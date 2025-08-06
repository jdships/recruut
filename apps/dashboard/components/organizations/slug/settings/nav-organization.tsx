'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { baseUrl, getPathname } from '@workspace/routes';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarGroupProps
} from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';

import { createOrganizationNavItems } from '~/components/organizations/slug/nav-items';
import { useActiveOrganization } from '~/hooks/use-active-organization';

export function NavOrganization(props: SidebarGroupProps): React.JSX.Element {
  const pathname = usePathname();
  const activeOrganization = useActiveOrganization();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="mb-1 text-sm text-muted-foreground">
        Organization
      </SidebarGroupLabel>
      <SidebarMenu>
        {createOrganizationNavItems(activeOrganization.slug).map(
          (item, index) => {
            const isActive = pathname.startsWith(
              getPathname(item.href, baseUrl.Dashboard)
            );
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link
                    href={item.disabled ? '~/' : item.href}
                    target={item.external ? '_blank' : undefined}
                  >
                    <item.icon
                      className={cn(
                        'size-4 shrink-0',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={
                        isActive
                          ? 'dark:text-foreground'
                          : 'dark:text-muted-foreground'
                      }
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
