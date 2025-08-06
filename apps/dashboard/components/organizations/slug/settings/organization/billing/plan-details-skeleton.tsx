import * as React from 'react';

import { Skeleton } from '@workspace/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@workspace/ui/components/table';

export function PlanDetailsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-4 w-56" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div>
        <Skeleton className="h-8 w-36" />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex justify-between space-x-8 pb-1 align-baseline">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b hover:bg-inherit">
              <TableHead className="max-w-[200px] truncate text-left font-medium text-inherit">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="pr-4 text-right font-medium text-inherit">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableHead>
              <TableHead className="max-w-[200px] truncate text-left font-medium text-inherit">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="text-right font-medium text-inherit">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b hover:bg-inherit">
              <TableCell className="max-w-[200px] truncate">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="pr-4 text-right">
                <Skeleton className="ml-auto h-4 w-8" />
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-inherit">
              <TableCell>
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-4 w-32" />
                </div>
              </TableCell>
              <TableCell
                colSpan={3}
                className="text-right font-medium"
              >
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Skeleton className="mt-1 h-1 w-full" />
      </div>
    </div>
  );
}
