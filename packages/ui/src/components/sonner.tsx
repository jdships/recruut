'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast } from 'sonner';

export type ToasterElement = React.ComponentRef<typeof Sonner>;
export type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = (props: ToasterProps): React.JSX.Element => {
  const { theme = 'system' } = useTheme();
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, toast };
