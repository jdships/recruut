import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function BillingAddressLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Billing address"
      description="This will be reflected in every upcoming invoice, past invoices are not affected."
    >
      {children}
    </AnnotatedSection>
  );
}
