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

export function BusinessHoursSkeletonCard({
  className,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <Card
      className={cn('pt-0 gap-0', className)}
      {...props}
    >
      <CardContent className="p-0">
        <div className="mb-2 mt-4 space-y-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Separator />}
              <div className="w-full px-6">
                <Skeleton className="h-10 w-full" />
              </div>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end pt-6">
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  );
}
