'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

export type AvatarElement = React.ComponentRef<typeof AvatarPrimitive.Root>;
export type AvatarProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
>;
function Avatar({ className, ...props }: AvatarProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  );
}

export type AvatarImageElement = React.ComponentRef<
  typeof AvatarPrimitive.Image
>;
export type AvatarImageProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
>;
function AvatarImage({
  className,
  ...props
}: AvatarImageProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  );
}

export type AvatarFallbackElement = React.ComponentRef<
  typeof AvatarPrimitive.Fallback
>;
export type AvatarFallbackProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
>;
function AvatarFallback({
  className,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
