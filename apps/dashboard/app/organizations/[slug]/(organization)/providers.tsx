'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';

import { SidebarProvider } from '@workspace/ui/components/sidebar';

import {
  ActiveOrganizationProvider,
  type ActiveOrganization
} from '~/hooks/use-active-organization';

export type ProvidersProps = React.PropsWithChildren<{
  organization: ActiveOrganization;
  defaultOpen?: boolean;
  defaultWidth?: string;
}>;

export function Providers({
  organization,
  defaultOpen,
  defaultWidth,
  children
}: ProvidersProps): React.JSX.Element {
  return (
    <ActiveOrganizationProvider organization={organization}>
      {/* Provide a second modal provider so we can use 'useActiveOrganization' in modals */}
      <NiceModal.Provider>
        <SidebarProvider
          defaultOpen={defaultOpen}
          defaultWidth={defaultWidth}
        >
          {children}
        </SidebarProvider>
      </NiceModal.Provider>
    </ActiveOrganizationProvider>
  );
}
