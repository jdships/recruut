import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function DangerZoneLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Danger zone"
      description="Be careful, deleting cannot be undone. Only the owner can delete an organization."
    >
      {children}
    </AnnotatedSection>
  );
}
