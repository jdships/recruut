'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  type Row
} from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';

import { replaceOrgSlug, routes } from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableColumnOptionsHeader,
  DataTablePagination
} from '@workspace/ui/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { CenteredSpinner } from '@workspace/ui/components/spinner';
import { TagList } from '@workspace/ui/components/tag-input';
import { cn } from '@workspace/ui/lib/utils';

import { contactStageColor } from '~/components/organizations/slug/contacts/contact-stage-color';
import { ContactsBulkActions } from '~/components/organizations/slug/contacts/contacts-bulk-actions';
import { searchParams } from '~/components/organizations/slug/contacts/contacts-search-params';
import { DeleteContactModal } from '~/components/organizations/slug/contacts/delete-contact-modal';
import { ContactAvatar } from '~/components/organizations/slug/contacts/details/contact-avatar';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useTransitionContext } from '~/hooks/use-transition-context';
import { contactStageLabel } from '~/lib/labels';
import { GetContactsSortBy } from '~/schemas/contacts/get-contacts-schema';
import type { ContactDto } from '~/types/dtos/contact-dto';
import { SortDirection } from '~/types/sort-direction';

export type ContactsDataTableProps = {
  data: ContactDto[];
  totalCount: number;
};

export function ContactsDataTable({
  data,
  totalCount
}: ContactsDataTableProps): React.JSX.Element {
  const router = useRouter();
  const activeOrganization = useActiveOrganization();
  const { isLoading, startTransition } = useTransitionContext();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [sorting, setSorting] = useQueryStates(
    {
      sortBy: searchParams.sortBy,
      sortDirection: searchParams.sortDirection
    },
    {
      history: 'push',
      startTransition,
      shallow: false
    }
  );

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: searchParams.pageIndex,
      pageSize: searchParams.pageSize
    },
    {
      history: 'push',
      startTransition,
      shallow: false
    }
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: [
        {
          id: sorting.sortBy,
          desc: sorting.sortDirection === SortDirection.Desc
        }
      ],
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    pageCount: Math.max(
      1,
      Math.ceil(totalCount / Math.max(1, pagination.pageSize))
    ),
    defaultColumn: {
      minSize: 0,
      size: 0
    },
    getRowId: (row, _relativeIndex, parent) => (parent ? parent.id : row.id),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updaterOrValue) => {
      const newSorting =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(table.getState().sorting)
          : updaterOrValue;

      if (newSorting.length > 0) {
        setSorting({
          sortBy: newSorting[0].id as GetContactsSortBy,
          sortDirection: newSorting[0].desc
            ? SortDirection.Desc
            : SortDirection.Asc
        });
      } else {
        setSorting({
          sortBy: GetContactsSortBy.Name,
          sortDirection: SortDirection.Asc
        });
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true
  });

  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

  const handleRowClicked = (row: Row<ContactDto>): void => {
    router.push(
      `${replaceOrgSlug(routes.dashboard.organizations.slug.Contacts, activeOrganization.slug)}/${row.original.id}`
    );
  };

  return (
    <div className="relative flex flex-col overflow-hidden">
      <ScrollArea
        verticalScrollBar
        horizontalScrollBar
        className="h-full"
      >
        {/* 56px (primary bar)
              + 48px (secondary bar)
              + 57px (pagination + border-t)
              = 161px
            */}
        <DataTable
          fixedHeader
          table={table}
          wrapperClassName="h-[calc(100svh-161px)] overflow-visible"
          onRowClicked={handleRowClicked}
        />
      </ScrollArea>
      <DataTablePagination table={table} />
      {isLoading && <CenteredSpinner />}
      {hasSelectedRows && <ContactsBulkActions table={table} />}
    </div>
  );
}

const columns: ColumnDef<ContactDto>[] = [
  {
    id: 'select',
    size: 64,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mx-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    meta: {
      title: 'Name'
    },
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => (
      <div className="flex w-fit flex-row items-center gap-2">
        <ContactAvatar
          record={row.original.record}
          src={row.original.image}
        />
        <div className="whitespace-nowrap text-sm font-medium">
          {row.original.name}
        </div>
      </div>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    meta: {
      title: 'Email'
    },
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">{row.original.email}</span>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    meta: {
      title: 'Phone'
    },
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Phone"
      />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">{row.original.phone}</span>
    ),
    enableSorting: true,
    enableHiding: true
  },
  {
    meta: {
      title: 'Stage'
    },
    accessorKey: 'stage',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Stage"
      />
    ),
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-2 whitespace-nowrap">
        <div
          className={cn(
            'size-2.5 rounded-full border-2 bg-background',
            contactStageColor[row.original.stage]
          )}
        />
        {contactStageLabel[row.original.stage]}
      </div>
    )
  },
  {
    meta: {
      title: 'Tags'
    },
    accessorKey: 'tags',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tags"
      />
    ),
    cell: ({ row }) => (
      <TagList
        tags={row.original.tags}
        className="flex-nowrap text-clip"
        size="sm"
        variant="default"
        shape="rounded"
        borderStyle="default"
        textCase={null}
        interaction="nonClickable"
        textStyle="normal"
        animation="fadeIn"
        direction="row"
      />
    ),
    enableSorting: false,
    enableHiding: true
  },
  {
    id: 'actions',
    size: 64,
    header: ({ table }) => <DataTableColumnOptionsHeader table={table} />,
    cell: ({ row }) => <ActionsCell row={row} />
  }
];

function ActionsCell({ row }: { row: Row<ContactDto> }): React.JSX.Element {
  const activeOrganization = useActiveOrganization();
  const handleShowDeleteContactModal = (): void => {
    NiceModal.show(DeleteContactModal, { contact: row.original });
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="ml-auto mr-4 flex size-8 data-[state=open]:bg-muted"
          onClick={(e) => e.stopPropagation()}
          title="Open menu"
        >
          <MoreHorizontalIcon className="size-4 shrink-0" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          asChild
          className="cursor-pointer"
        >
          <Link
            href={`${replaceOrgSlug(routes.dashboard.organizations.slug.Contacts, activeOrganization.slug)}/${row.original.id}`}
          >
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive!"
          onClick={(e) => {
            e.stopPropagation();
            handleShowDeleteContactModal();
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
