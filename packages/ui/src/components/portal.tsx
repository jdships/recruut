import { Portal as PortalPrimitive } from 'radix-ui';

export type PortalElement = React.ComponentRef<typeof PortalPrimitive.Root>;
export type PortalProps = React.ComponentPropsWithoutRef<
  typeof PortalPrimitive.Root
>;
export const Portal = PortalPrimitive.Root;
