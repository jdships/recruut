import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function InvitationsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Invitations"
      description="Manage invitations of users who haven't accepted yet."
    >
      {children}
    </AnnotatedSection>
  );
}
