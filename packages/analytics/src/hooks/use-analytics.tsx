'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { AnalyticsProvider as AnalyticsProviderImpl } from '../provider';
import type { AnalyticsProvider as AnalyticsProviderInterface } from '../provider/types';

function useTrackPageView(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const url = [pathname, searchParams.toString()].filter(Boolean).join('?');
    AnalyticsProviderImpl.trackPageView(url);
  }, [pathname, searchParams]);
}

export const AnalyticsContext = React.createContext<AnalyticsProviderInterface>(
  AnalyticsProviderImpl
);

export function AnalyticsProvider(props: React.PropsWithChildren) {
  if (typeof window === 'undefined') {
    return props.children;
  }
  useTrackPageView();
  return (
    <AnalyticsContext.Provider value={AnalyticsProviderImpl}>
      {props.children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsProviderInterface {
  return React.useContext(AnalyticsContext);
}
