import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function PreferencesLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="Preferences"
      description="Change your preferred language and theme."
    >
      {children}
    </AnnotatedSection>
  );
}
