import * as React from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@workspace/routes';

import { SignUpCard } from '~/components/auth/sign-up/sign-up-card';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Sign up')
};

export default function SignUpPage(): React.JSX.Element {
  return (
    <>
      <SignUpCard />
      <div className="px-2 text-xs text-muted-foreground">
        By signing up, you agree to our{' '}
        <Link
          prefetch={false}
          href={routes.marketing.TermsOfUse}
          className="text-foreground underline"
        >
          Terms of Use
        </Link>{' '}
        and{' '}
        <Link
          prefetch={false}
          href={routes.marketing.PrivacyPolicy}
          className="text-foreground underline"
        >
          Privacy Policy
        </Link>
        . Need help?{' '}
        <Link
          prefetch={false}
          href={routes.marketing.Contact}
          className="text-foreground underline"
        >
          Get in touch
        </Link>
        .
      </div>
    </>
  );
}
