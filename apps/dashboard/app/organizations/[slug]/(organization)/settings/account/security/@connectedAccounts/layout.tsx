import * as React from 'react';

import { AnnotatedSection } from '@workspace/ui/components/annotated';

import { PasswordLoginHint } from '~/components/organizations/slug/settings/account/security/password-login-hint';

export default function ConnectedAccountsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <>
      <AnnotatedSection
        title="Connected accounts"
        description="Sign up faster to your account by linking it to Google or Microsoft."
      >
        {children}
      </AnnotatedSection>
      <PasswordLoginHint />
    </>
  );
}
