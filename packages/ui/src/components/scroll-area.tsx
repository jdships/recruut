'use client';

import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';

import {
  useMediaQuery,
  type UseMediaQueryOptions
} from '@workspace/ui/hooks/use-media-query';

import { cn } from '../lib/utils';

export type ScrollAreaElement = React.ComponentRef<
  typeof ScrollAreaPrimitive.Root
>;
export type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> & {
  verticalScrollBar?: boolean;
  horizontalScrollBar?: boolean;
};
function ScrollArea({
  verticalScrollBar = true,
  horizontalScrollBar = false,
  className,
  children,
  ...props
}: ScrollAreaProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {verticalScrollBar && <ScrollBar orientation="vertical" />}
      {horizontalScrollBar && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

export type ScrollBarElement = React.ComponentRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;
export type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;
function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollBarProps): React.JSX.Element {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export type ResponsiveScrollAreaElement = HTMLDivElement;
export type ResponsiveScrollAreaProps = ScrollAreaProps & {
  breakpoint: string;
  mediaQueryOptions?: UseMediaQueryOptions;
  fallbackProps?: React.HTMLAttributes<HTMLDivElement>;
};
function ResponsiveScrollArea({
  breakpoint,
  mediaQueryOptions,
  fallbackProps,
  verticalScrollBar,
  horizontalScrollBar,
  className,
  children,
  ...scrollAreaProps
}: ResponsiveScrollAreaProps): React.JSX.Element {
  const isMatched = useMediaQuery(breakpoint, mediaQueryOptions);
  if (isMatched) {
    return (
      <ScrollArea
        verticalScrollBar={verticalScrollBar}
        horizontalScrollBar={horizontalScrollBar}
        className={className}
        {...scrollAreaProps}
      >
        {children}
      </ScrollArea>
    );
  }
  return (
    <div
      className={className}
      {...fallbackProps}
    >
      {children}
    </div>
  );
}

export { ResponsiveScrollArea, ScrollArea, ScrollBar };
