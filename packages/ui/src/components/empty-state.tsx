import { cn } from '../lib/utils';

export type EmptyStateElement = HTMLDivElement;
export type EmptyStateProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};
const EmptyState = ({
  title,
  description,
  icon,
  children,
  className,
  ...props
}: EmptyStateProps): React.JSX.Element => {
  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        'flex h-full flex-col items-center justify-center gap-6 rounded-lg border px-8 py-12 sm:px-10 md:px-12',
        className
      )}
      {...props}
    >
      {icon}
      <div className="mx-auto flex max-w-sm flex-col gap-2 text-balance text-center">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
};

export { EmptyState };
