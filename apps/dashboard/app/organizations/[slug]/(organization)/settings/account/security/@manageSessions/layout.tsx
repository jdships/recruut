import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function ManageSessionsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Manage sessions"
      description="Sign out your active sessions on other browsers and devices."
    >
      {children}
    </AnnotatedSection>
  );
}
