import * as React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function PreferencesSkeletonCard(props: CardProps): React.JSX.Element {
  return (
    <Card {...props}>
      <CardContent>
        <div className="flex flex-col gap-8">
          <div className="mb-2 flex flex-col space-y-2">
            <Skeleton className="h-[14px] w-20 my-[3.5px]" />
            <Skeleton className="h-5 w-[330px]" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="mb-2 flex flex-col space-y-2">
            <Skeleton className="h-[14px] w-20 my-[3.5px]" />
            <Skeleton className="h-5 w-[330px]" />
            <div className="flex flex-row flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-1"
                >
                  <Skeleton className="flex w-[118px] h-20 overflow-hidden rounded-lg" />
                  <div className="flex w-full justify-center p-2 pb-0">
                    <Skeleton className="w-10" />
                  </div>
                </div>
              ))}
            </div>
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
