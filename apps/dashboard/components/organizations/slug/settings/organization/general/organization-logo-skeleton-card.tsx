'use client';

import * as React from 'react';

import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import {
  Card,
  CardContent,
  type CardProps
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function OrganizationLogoSkeletonCard(
  props: CardProps
): React.JSX.Element {
  return (
    <Card {...props}>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Skeleton className="flex size-20 items-center justify-center rounded-xl border border-dashed bg-background p-0.5">
            <Avatar className="size-[72px] rounded-md">
              <AvatarFallback className="size-[72px] rounded-md" />
            </Avatar>
          </Skeleton>
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
