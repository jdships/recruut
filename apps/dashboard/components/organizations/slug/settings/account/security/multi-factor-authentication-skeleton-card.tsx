import * as React from 'react';

import {
  Card,
  CardContent,
  type CardProps
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';

export function MultiFactorAuthenticationSkeletonCard({
  className,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <Card
      className={cn('p-0', className)}
      {...props}
    >
      <CardContent className="max-h-72 flex-1 overflow-hidden p-0">
        <div className="divide-y">
          <div className="flex flex-row items-center justify-between p-6">
            <div className="flex flex-row items-center gap-4">
              <Skeleton className="size-6 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>
            <Skeleton className="h-9 w-[96px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
