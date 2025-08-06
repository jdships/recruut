import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function InvoicesLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Invoices"
      description="Invoices are sent automatically to your billing email."
    >
      {children}
    </AnnotatedSection>
  );
}
