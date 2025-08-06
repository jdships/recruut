import * as React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  type CardProps
} from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function OrgnanizationSlugSkeletonCard(
  props: CardProps
): React.JSX.Element {
  return (
    <Card {...props}>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-[19px] w-[200px]" />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex w-full justify-end">
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  );
}
