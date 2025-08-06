'use client';

import * as React from 'react';
import { TriangleAlertIcon } from 'lucide-react';

import { useCaptureError } from '@workspace/monitoring/hooks/use-capture-error';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';

export type DefaultErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function DefaultError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: { digest, ...error },
  reset
}: DefaultErrorProps): React.JSX.Element {
  useCaptureError(error);
  const handleReset = (): void => {
    reset?.();
  };
  return (
    <Card className="border-dashed shadow-none">
      <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
        <div className="flex items-center justify-center rounded-md border bg-background p-2 shadow-xs">
          <TriangleAlertIcon className="size-4 shrink-0" />
        </div>
        <p className="text-sm text-muted-foreground">
          Unexpected error occured.
        </p>
        <Button
          type="button"
          variant="default"
          size="default"
          onClick={handleReset}
        >
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
