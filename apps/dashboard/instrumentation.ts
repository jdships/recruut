import { MonitoringProvider } from '@workspace/monitoring/provider';

export const register = MonitoringProvider.register;
export const onRequestError = MonitoringProvider.captureRequestError;
