import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon
} from 'lucide-react';

import { cn } from '../lib/utils';
import { buttonVariants, type ButtonProps } from './button';

export type PaginationElement = React.ComponentRef<'nav'>;
export type PaginationProps = React.ComponentProps<'nav'>;
function Pagination({
  className,
  ...props
}: PaginationProps): React.JSX.Element {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

export type PaginationContentElement = React.ComponentRef<'ul'>;
export type PaginationContentProps = React.ComponentProps<'ul'>;
function PaginationContent({
  className,
  ...props
}: PaginationContentProps): React.JSX.Element {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

export type PaginationItemElement = React.ComponentRef<'li'>;
export type PaginationItemProps = React.ComponentProps<'li'>;
function PaginationItem(props: PaginationItemProps): React.JSX.Element {
  return (
    <li
      data-slot="pagination-item"
      {...props}
    />
  );
}

export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;
function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps): React.JSX.Element {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size
        }),
        className
      )}
      {...props}
    />
  );
}

export type PaginationPreviousElement = React.ComponentRef<
  typeof PaginationLink
>;
export type PaginationPreviousProps = React.ComponentProps<
  typeof PaginationLink
>;
function PaginationPrevious({
  className,
  ...props
}: PaginationPreviousProps): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

export type PaginationNextElement = React.ComponentRef<typeof PaginationLink>;
export type PaginationNextProps = React.ComponentProps<typeof PaginationLink>;
function PaginationNext({
  className,
  ...props
}: PaginationNextProps): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

export type PaginationEllipsisElement = React.ComponentRef<'span'>;
export type PaginationEllipsisProps = React.ComponentProps<'span'>;
function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps): React.JSX.Element {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
};
