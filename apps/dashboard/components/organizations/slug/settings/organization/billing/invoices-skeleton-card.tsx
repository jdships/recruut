import * as React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';

export function InvoicesSkeletonCard({
  className,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <Card
      className={cn('p-0', className)}
      {...props}
    >
      <CardContent className="p-0">
        <div className="flex h-[88px] flex-row justify-between p-6">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>
          <Skeleton className="size-8" />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end">
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  );
}
