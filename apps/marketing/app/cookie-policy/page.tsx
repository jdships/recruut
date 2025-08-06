import * as React from 'react';
import type { Metadata } from 'next';

import { CookiePolicy } from '~/components/sections/cookie-policy';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Cookie Policy')
};

export default function CookiePolicyPage(): React.JSX.Element {
  return <CookiePolicy />;
}
