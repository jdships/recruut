import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function BillingEmailLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Email recipient"
      description="All billing correspondence will go to this email."
    >
      {children}
    </AnnotatedSection>
  );
}
