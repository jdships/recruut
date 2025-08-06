'use client';

import * as React from 'react';

import { getAuthOrganizationContext } from '@workspace/auth/context';

export type ActiveOrganization = Awaited<
  ReturnType<typeof getAuthOrganizationContext>
>['organization'];

const OrganizationContext = React.createContext<ActiveOrganization | undefined>(
  undefined
);

export function ActiveOrganizationProvider({
  organization,
  children
}: React.PropsWithChildren<{ organization: ActiveOrganization }>) {
  return (
    <OrganizationContext.Provider value={organization}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useActiveOrganization() {
  const context = React.useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useActiveOrganization must be used within an ActiveOrganizationProvider'
    );
  }
  return context;
}
