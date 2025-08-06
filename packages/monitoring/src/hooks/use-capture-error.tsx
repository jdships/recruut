'use client';

import * as React from 'react';

import { useMonitoring } from './use-monitoring';

export function useCaptureError(error: unknown): void {
  const provider = useMonitoring();

  React.useEffect(() => {
    void provider.captureError(error);
  }, [error, provider]);
}
