import * as React from 'react';
import type { Metadata } from 'next';

import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Settings')
};

export default function SettingsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <div className="size-full">{children}</div>
    </div>
  );
}
