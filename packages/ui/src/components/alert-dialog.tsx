'use client';

import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';
import { buttonVariants } from './button';

export type AlertDialogElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Root
>;
export type AlertDialogProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
>;

function AlertDialog(props: AlertDialogProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Root
      data-slot="alert-dialog"
      {...props}
    />
  );
}

export type AlertDialogTriggerElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Trigger
>;
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Trigger
>;

function AlertDialogTrigger(props: AlertDialogTriggerProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Trigger
      data-slot="alert-dialog-trigger"
      {...props}
    />
  );
}

export type AlertDialogPortalElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Portal
>;
export type AlertDialogPortalProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Portal
>;

function AlertDialogPortal(props: AlertDialogPortalProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Portal
      data-slot="alert-dialog-portal"
      {...props}
    />
  );
}

export type AlertDialogOverlayElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Overlay
>;
export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Overlay
>;
function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogOverlayProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'fill-mode-forwards! data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  );
}

export type AlertDialogContentElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Content
>;
export type AlertDialogContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
  'onEscapeKeyDown'
> & {
  onClose?: () => void;
};
function AlertDialogContent({
  onClose,
  className,
  ...props
}: AlertDialogContentProps): React.JSX.Element {
  const handleClose = (): void => {
    onClose?.();
  };
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'fill-mode-forwards! bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        onEscapeKeyDown={handleClose}
        {...props}
      />
    </AlertDialogPortal>
  );
}

export type AlertDialogHeaderElement = React.ComponentRef<'div'>;
export type AlertDialogHeaderProps = React.ComponentPropsWithoutRef<'div'>;
function AlertDialogHeader({
  className,
  ...props
}: AlertDialogHeaderProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export type AlertDialogFooterElement = React.ComponentRef<'div'>;
export type AlertDialogFooterProps = React.ComponentPropsWithoutRef<'div'>;
function AlertDialogFooter({
  className,
  ...props
}: AlertDialogFooterProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

export type AlertDialogTitleElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Title
>;
export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Title
>;
function AlertDialogTitle({
  className,
  ...props
}: AlertDialogTitleProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
}

export type AlertDialogDescriptionElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Description
>;
export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;
function AlertDialogDescription({
  className,
  ...props
}: AlertDialogDescriptionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export type AlertDialogActionElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Action
>;
export type AlertDialogActionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
>;
function AlertDialogAction({
  className,
  ...props
}: AlertDialogActionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

export type AlertDialogCancelElement = React.ComponentRef<
  typeof AlertDialogPrimitive.Cancel
>;
export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
>;
function AlertDialogCancel({
  className,
  ...props
}: AlertDialogCancelProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
};
