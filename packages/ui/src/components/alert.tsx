import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg text-foreground border p-4 text-sm grid items-start gap-y-0.5 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 grid-cols-[0_1fr]',
  {
    variants: {
      variant: {
        default: 'bg-background',
        info: 'bg-blue-500/10 border border-transparent dark:border-blue-900',
        warning:
          'bg-yellow-500/10 border border-transparent dark:border-yellow-900',
        destructive: 'bg-destructive/10 border border-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export type AlertElement = React.ComponentRef<'div'>;
export type AlertProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof alertVariants>;
function Alert({
  className,
  variant,
  ...props
}: AlertProps): React.JSX.Element {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export type AlertTitleElement = React.ComponentRef<'div'>;
export type AlertTitleProps = React.ComponentPropsWithoutRef<'div'>;
function AlertTitle({
  className,
  ...props
}: AlertTitleProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
        className
      )}
      {...props}
    />
  );
}

export type AlertDescriptionElement = React.ComponentRef<'div'>;
export type AlertDescriptionProps = React.ComponentPropsWithoutRef<'div'>;
function AlertDescription({
  className,
  ...props
}: AlertDescriptionProps): React.JSX.Element {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
