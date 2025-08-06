import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function OrganizationSlugLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="URL"
      description="Update your organization's slug for a new URL. You will be redirected to the new URL."
    >
      {children}
    </AnnotatedSection>
  );
}
