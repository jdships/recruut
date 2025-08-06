import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';

import { cn } from '../lib/utils';

export type RadioCardsElement = React.ComponentRef<
  typeof RadioGroupPrimitive.Root
>;
export type RadioCardsProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
>;
const RadioCards = ({
  value,
  onValueChange,
  ...props
}: RadioCardsProps): React.JSX.Element => (
  <RadioGroupPrimitive.Root
    value={value}
    onValueChange={onValueChange}
    {...props}
  />
);

export type RadioCardItemElement = React.ComponentRef<
  typeof RadioGroupPrimitive.Item
>;
export type RadioCardItemProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> & {
  checkClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
};
const RadioCardItem = ({
  className,
  checkClassName,
  children,
  ...props
}: RadioCardItemProps): React.JSX.Element => (
  <RadioGroupPrimitive.Item
    className={cn(
      'group relative overflow-hidden rounded-md border border-border p-4',
      'hover:border-border-primary focus:border-border-primary focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-border-primary data-[state=checked]:bg-bg-primary/5',
      className
    )}
    {...props}
  >
    {children}
    <div
      className={cn(
        'absolute cursor-pointer bottom-2 right-2 flex size-4 items-center justify-center rounded-full border border-border bg-bg group-data-[state=checked]:border-border-primary group-data-[state=checked]:bg-bg-primary',
        checkClassName
      )}
    >
      <CheckIcon className="size-3 shrink-0 text-fg-on-primary opacity-0 group-data-[state=checked]:opacity-100" />
    </div>
  </RadioGroupPrimitive.Item>
);

export { RadioCardItem, RadioCards };
