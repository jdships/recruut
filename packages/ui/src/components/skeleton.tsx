import React from 'react';

import { cn } from '../lib/utils';

export type SkeletonElement = HTMLDivElement;
export type SkeletonProps = React.ComponentPropsWithoutRef<'div'>;
function Skeleton({ className, ...props }: SkeletonProps): React.JSX.Element {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
