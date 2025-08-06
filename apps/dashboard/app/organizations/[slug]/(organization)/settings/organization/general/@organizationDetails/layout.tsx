import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function OrganizationDetailsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Details"
      description="Basic details about your organization."
    >
      {children}
    </AnnotatedSection>
  );
}
