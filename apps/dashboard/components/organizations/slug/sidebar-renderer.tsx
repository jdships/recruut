'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import {
  baseUrl,
  getPathname,
  replaceOrgSlug,
  routes
} from '@workspace/routes';

import { AppSidebar } from '~/components/organizations/slug/app-sidebar';
import { SettingsSidebar } from '~/components/organizations/slug/settings/settings-sidebar';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import type { FavoriteDto } from '~/types/dtos/favorite-dto';
import type { OrganizationDto } from '~/types/dtos/organization-dto';
import type { ProfileDto } from '~/types/dtos/profile-dto';

export type SidebarRendererProps = {
  organizations: OrganizationDto[];
  favorites: FavoriteDto[];
  profile: ProfileDto;
};

export function SidebarRenderer(
  props: SidebarRendererProps
): React.JSX.Element {
  const pathname = usePathname();
  const activeOrganization = useActiveOrganization();
  const settingsRoute = replaceOrgSlug(
    routes.dashboard.organizations.slug.settings.Index,
    activeOrganization.slug
  );

  if (pathname.startsWith(getPathname(settingsRoute, baseUrl.Dashboard))) {
    return <SettingsSidebar />;
  }

  return <AppSidebar {...props} />;
}
