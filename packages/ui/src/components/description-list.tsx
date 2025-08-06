import { cn } from '../lib/utils';

export type DescriptionListElement = React.ComponentRef<'dl'>;
export type DescriptionListProps = React.ComponentProps<'dl'>;
export const DescriptionList = ({
  className,
  ...props
}: DescriptionListProps): React.JSX.Element => {
  return (
    <dl
      className={cn(
        'text-base sm:text-sm [@apply/text-pretty]:[--font-feature-settings:normal] group/dl',
        className
      )}
      {...props}
    />
  );
};
