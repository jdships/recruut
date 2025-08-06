import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function ChangePasswordLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Change password"
      description="To make an update, enter your existing password followed by a new one. If you don't know your existing password, sign out and use the forgot password link."
    >
      {children}
    </AnnotatedSection>
  );
}
