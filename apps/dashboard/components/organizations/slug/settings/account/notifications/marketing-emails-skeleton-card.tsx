import * as React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function MarketingEmailsSkeletonCard(
  props: CardProps
): React.JSX.Element {
  return (
    <Card {...props}>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-row items-center justify-between"
            >
              <div className="space-y-0.5">
                <Skeleton className="h-[14px] w-[110px]" />
                <Skeleton className="h-5 w-[220px]" />
              </div>
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end">
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  );
}
