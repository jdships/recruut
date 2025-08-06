import * as React from 'react';
import type { Metadata } from 'next';

import { PrivacyPolicy } from '~/components/sections/privacy-policy';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Privacy Policy')
};

export default function PrivacyPolicyPage(): React.JSX.Element {
  return <PrivacyPolicy />;
}
