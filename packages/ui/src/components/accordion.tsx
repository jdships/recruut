'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

export type AccordionElement = React.ComponentRef<
  typeof AccordionPrimitive.Root
>;
export type AccordionProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
>;
function Accordion(props: AccordionProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      {...props}
    />
  );
}

export type AccordionItemElement = React.ComponentRef<
  typeof AccordionPrimitive.Item
>;
export type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
>;
function AccordionItem({
  className,
  ...props
}: AccordionItemProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

export type AccordionTriggerElement = React.ComponentRef<
  typeof AccordionPrimitive.Trigger
>;
export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>;
function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 cursor-pointer flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export type AccordionContentElement = React.ComponentRef<
  typeof AccordionPrimitive.Content
>;
export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;
function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps): React.JSX.Element {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
