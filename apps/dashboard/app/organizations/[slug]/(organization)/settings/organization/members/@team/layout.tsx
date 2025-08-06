import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function TeamLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Team"
      description="Manage and invite your colleagues."
    >
      {children}
    </AnnotatedSection>
  );
}
