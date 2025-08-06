'use client';

import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

export type CollapsibleElement = React.ComponentRef<
  typeof CollapsiblePrimitive.Root
>;
export type CollapsibleProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Root
>;
function Collapsible(props: CollapsibleProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      {...props}
    />
  );
}

export type CollapsibleTriggerElement = React.ComponentRef<
  typeof CollapsiblePrimitive.CollapsibleTrigger
>;
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleTrigger
>;
function CollapsibleTrigger(props: CollapsibleTriggerProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

export type CollapsibleContentElement = React.ComponentRef<
  typeof CollapsiblePrimitive.CollapsibleContent
>;
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleContent
>;
function CollapsibleContent(props: CollapsibleContentProps): React.JSX.Element {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
