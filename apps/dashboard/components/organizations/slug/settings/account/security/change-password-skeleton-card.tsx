import * as React from 'react';

import { Card, CardContent, CardFooter } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function ChangePasswordSkeletonCard(): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[14px] w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[14px] w-20" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-5 w-[292px]" />
          </div>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[14px] w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end">
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  );
}
