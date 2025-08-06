'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

export type TooltipProviderElement = React.ComponentRef<
  typeof TooltipPrimitive.Provider
>;
export type TooltipProviderProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Provider
>;
function TooltipProvider({
  delayDuration = 0,
  ...props
}: TooltipProviderProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

export type TooltipElement = React.ComponentRef<typeof TooltipPrimitive.Root>;
export type TooltipProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Root
>;
function Tooltip(props: TooltipProps): React.JSX.Element {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        {...props}
      />
    </TooltipProvider>
  );
}

export type TooltipTriggerElement = React.ComponentRef<
  typeof TooltipPrimitive.Trigger
>;
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Trigger
>;
function TooltipTrigger(props: TooltipTriggerProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...props}
    />
  );
}

export type TooltipContentElement = React.ComponentRef<
  typeof TooltipPrimitive.Content
>;
export type TooltipContentProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
>;
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: TooltipContentProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
