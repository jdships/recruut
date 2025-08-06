import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function OrganizationLogoLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Logo"
      description="Update your organization's logo to make it easier to identify."
    >
      {children}
    </AnnotatedSection>
  );
}
