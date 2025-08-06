import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { routes } from '@workspace/routes';
import { Logo } from '@workspace/ui/components/logo';
import { ThemeToggle } from '@workspace/ui/components/theme-toggle';

import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Invitations')
};

export default async function InvitationsLayout({
  children
}: React.PropsWithChildren): Promise<React.JSX.Element> {
  return (
    <main className="h-screen dark:bg-background bg-gray-50 px-4">
      <div className="mx-auto w-full min-w-[320px] space-y-6 py-12 max-w-sm">
        <Link
          href={routes.marketing.Index}
          className="block w-fit mx-auto"
        >
          <Logo />
        </Link>
        {children}
      </div>
      <ThemeToggle className="fixed bottom-2 right-2 rounded-full" />
    </main>
  );
}
