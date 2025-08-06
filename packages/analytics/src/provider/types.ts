export type AnalyticsProvider = {
  trackEvent(
    eventName: string,
    eventProperties?: Record<string, string | string[]>
  ): Promise<void>;
  trackPageView(path: string): Promise<void>;
  identify(userId: string, traits?: Record<string, string>): Promise<void>;
};
