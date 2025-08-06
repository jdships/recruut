import * as React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  type CardProps
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';

export function InvitationsSkeletonCard({
  className,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <Card
      className={cn('gap-0 pb-0', className)}
      {...props}
    >
      <CardHeader className="pb-0 flex flex-row items-center gap-2">
        <div className="relative inline-block h-9 w-full">
          <span className="absolute left-3 top-1/2 flex -translate-y-1/2">
            <Skeleton className="size-6 shrink-0" />
          </span>
          <div className="flex h-9 w-full rounded-md border border-input py-1 pl-10 pr-3 shadow-xs">
            <Skeleton className="w-full max-w-full" />
          </div>
        </div>
        <Skeleton className="inline-block h-9 w-[168px]" />
      </CardHeader>
      <CardContent className="p-0">
        <ul className="list-none">
          <li className="flex w-full flex-row justify-between p-6">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-[108px]" />
              <Skeleton className="h-4 w-[168px]" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <Skeleton className="hidden h-[22px] w-[60px] rounded-3xl sm:inline-block" />
              <Skeleton className="size-8" />
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
