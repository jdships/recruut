import * as React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Slot as SlotPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

export type BreadcrumbElement = React.ComponentRef<'nav'>;
export type BreadcrumbProps = React.ComponentPropsWithoutRef<'nav'>;
function Breadcrumb(props: BreadcrumbProps): React.JSX.Element {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      {...props}
    />
  );
}

export type BreadcrumbListElement = React.ComponentRef<'ol'>;
export type BreadcrumbListProps = React.ComponentPropsWithoutRef<'ol'>;
function BreadcrumbList({
  className,
  ...props
}: BreadcrumbListProps): React.JSX.Element {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
        className
      )}
      {...props}
    />
  );
}

export type BreadcrumbItemElement = React.ComponentRef<'li'>;
export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<'li'>;
function BreadcrumbItem({
  className,
  ...props
}: BreadcrumbItemProps): React.JSX.Element {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
}

export type BreadcrumbLinkElement = React.ComponentRef<'a'>;
export type BreadcrumbLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean;
};
function BreadcrumbLink({
  asChild,
  className,
  ...props
}: BreadcrumbLinkProps): React.JSX.Element {
  const Comp = asChild ? SlotPrimitive.Slot : 'a';
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  );
}

export type BreadcrumbPageElement = React.ComponentRef<'span'>;
export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<'span'>;
function BreadcrumbPage({
  className,
  ...props
}: BreadcrumbPageProps): React.JSX.Element {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-foreground font-normal', className)}
      {...props}
    />
  );
}

export type BreadcrumbSeparatorElement = React.ComponentRef<'li'>;
export type BreadcrumbSeparatorProps = React.ComponentProps<'li'>;
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps): React.JSX.Element {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

export type BreadcrumbEllipsisElement = React.ComponentRef<'span'>;
export type BreadcrumbEllipsisProps = React.ComponentProps<'span'>;
function BreadcrumbEllipsis({
  className,
  ...props
}: BreadcrumbEllipsisProps): React.JSX.Element {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
};
