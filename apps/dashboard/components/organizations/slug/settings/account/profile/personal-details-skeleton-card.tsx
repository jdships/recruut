import * as React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function PersonalDetailsSkeletonCard(
  props: CardProps
): React.JSX.Element {
  return (
    <Card {...props}>
      <CardContent>
        <div className="flex items-center justify-center pb-6">
          <Skeleton className="size-[114px] rounded-full p-0.5" />
        </div>
        <div className="grid gap-x-8 gap-y-4">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[17px] w-20 my-[3.5px]" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[17px] w-20 my-[3.5px]" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-[17px] w-20 my-[3.5px]" />
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
