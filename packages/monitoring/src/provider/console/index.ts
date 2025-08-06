import type { ErrorContext, ErrorRequest, MonitoringProvider } from '../types';

class ConsoleMonitoringProvider implements MonitoringProvider {
  public withConfig<C>(nextConfig: C): C {
    return nextConfig;
  }

  public async register(): Promise<void> {
    console.info(`[Console Monitoring] Registered.`);
  }

  public captureRequestError(
    error: unknown,
    _errorRequest: Readonly<ErrorRequest>,
    _errorContext: Readonly<ErrorContext>
  ): void {
    const errorMessage = error instanceof Error ? error.message : '';
    console.info('[Console Monitoring] Request error occurred.', {
      error: errorMessage
    });
  }

  public captureError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : '';
    console.info('[Console Monitoring] Error occurred.', {
      error: errorMessage
    });
  }

  public captureEvent<Extra extends object>(
    event: string,
    _extra?: Extra
  ): void {
    console.info(`[Console Monitoring] Event captured: ${event}`);
  }

  public setUser<Info extends { id: string }>(user: Info): void {
    console.info(`[Console Monitoring] User tracked: ${user.id}`);
  }
}

export default new ConsoleMonitoringProvider();
