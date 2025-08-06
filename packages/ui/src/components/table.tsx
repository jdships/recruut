import * as React from 'react';

import { cn } from '../lib/utils';

export type TableElement = HTMLTableElement;
export type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  wrapperClassName?: React.HTMLAttributes<HTMLTableElement>['className'];
};
function Table({
  className,
  wrapperClassName,
  ...props
}: TableProps): React.JSX.Element {
  return (
    <div
      data-slot="table-container"
      className={cn('relative w-full overflow-auto', wrapperClassName)}
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

export type TableHeaderElement = HTMLTableSectionElement;
export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
function TableHeader({
  className,
  ...props
}: TableHeaderProps): React.JSX.Element {
  return (
    <thead
      data-slot="table-header"
      className={cn('bg-background [&_tr]:border-b', className)}
      {...props}
    />
  );
}

export type TableBodyElement = HTMLTableSectionElement;
export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  showLastRowBorder?: boolean;
};
function TableBody({
  showLastRowBorder,
  className,
  ...props
}: TableBodyProps): React.JSX.Element {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        !showLastRowBorder && '[&_tr:last-child]:border-0',
        className
      )}
      {...props}
    />
  );
}

export type TableFooterElement = HTMLTableSectionElement;
export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;
function TableFooter({
  className,
  ...props
}: TableFooterProps): React.JSX.Element {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

export type TableRowElement = HTMLTableRowElement;
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
function TableRow({ className, ...props }: TableRowProps): React.JSX.Element {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className
      )}
      {...props}
    />
  );
}

export type TableHeadElement = HTMLTableCellElement;
export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;
function TableHead({ className, ...props }: TableHeadProps): React.JSX.Element {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

export type TableCellElement = HTMLTableCellElement;
export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;
function TableCell({ className, ...props }: TableCellProps): React.JSX.Element {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

export type TableCaptionElement = HTMLTableCaptionElement;
export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>;
function TableCaption({
  className,
  ...props
}: TableCaptionProps): React.JSX.Element {
  return (
    <caption
      data-slot="table-caption"
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};
