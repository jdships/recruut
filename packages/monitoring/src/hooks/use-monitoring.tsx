'use client';

import * as React from 'react';

import { MonitoringProvider as MonitoringProviderImpl } from '../provider';
import type { MonitoringProvider as MonitoringProviderInterface } from '../provider/types';

export const MonitoringContext =
  React.createContext<MonitoringProviderInterface>(MonitoringProviderImpl);

export function MonitoringProvider(
  props: React.PropsWithChildren
): React.JSX.Element {
  const providerValue = React.useMemo(() => MonitoringProviderImpl, []);
  return (
    <MonitoringContext.Provider value={providerValue}>
      {props.children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring(): MonitoringProviderInterface {
  const context = React.useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}
