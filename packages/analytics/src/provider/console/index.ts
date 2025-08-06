import type { AnalyticsProvider } from '../types';

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  public async trackPageView(...args: unknown[]): Promise<void> {
    console.debug(
      `[Console Analytics] Called 'trackPageView' with args:`,
      ...args.filter(Boolean)
    );
  }

  public async trackEvent(...args: unknown[]): Promise<void> {
    console.debug(
      `[Console Analytics] Called 'trackEvent' with args:`,
      ...args.filter(Boolean)
    );
  }

  public async identify(...args: unknown[]): Promise<void> {
    console.debug(
      `[Console Analytics] Called 'identify' with args:`,
      ...args.filter(Boolean)
    );
  }
}

export default new ConsoleAnalyticsProvider();
