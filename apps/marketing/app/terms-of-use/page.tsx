import * as React from 'react';
import type { Metadata } from 'next';

import { TermsOfUse } from '~/components/sections/terms-of-use';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Terms of Use')
};

export default function TermsOfUsePage(): React.JSX.Element {
  return <TermsOfUse />;
}
