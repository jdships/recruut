'use client';

import * as React from 'react';
import NextError from 'next/error';

import { useCaptureError } from '@workspace/monitoring/hooks/use-capture-error';

export type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: { digest, ...error }
}: GlobalErrorProps): React.JSX.Element {
  useCaptureError(error);
  return (
    <html>
      <body>
        {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
        <NextError statusCode={undefined as never} />
      </body>
    </html>
  );
}
