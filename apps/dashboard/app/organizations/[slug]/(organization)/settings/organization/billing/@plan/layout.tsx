import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function PlanLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Plan"
      description="View, upgrade or cancel your plan. Billing is managed by our payment partner."
    >
      {children}
    </AnnotatedSection>
  );
}
