'use client';

import * as React from 'react';
import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';

export type AspectRatioElement = React.ComponentRef<
  typeof AspectRatioPrimitive.Root
>;
export type AspectRatioProps = React.ComponentPropsWithoutRef<
  typeof AspectRatioPrimitive.Root
>;

function AspectRatio(props: AspectRatioProps): React.JSX.Element {
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      {...props}
    />
  );
}

export { AspectRatio };
