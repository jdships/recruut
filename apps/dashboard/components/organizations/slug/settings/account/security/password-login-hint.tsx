import * as React from 'react';
import { InfoIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { cn } from '@workspace/ui/lib/utils';

export function PasswordLoginHint({
  className,
  ...other
}: React.HtmlHTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn('max-w-4xl px-6', className)}
      {...other}
    >
      <Alert>
        <InfoIcon className="size-[18px] shrink-0" />
        <AlertDescription className="inline">
          Regardless of connected accounts, you will always have a password
          login as well.
        </AlertDescription>
      </Alert>
    </div>
  );
}
