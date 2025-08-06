import { keys } from '../../../keys';
import type { AnalyticsProvider } from '../types';

declare global {
  interface Window {
    umami: {
      track: (
        event: string | Record<string, string>,
        properties?: Record<string, string>
      ) => void;
    };
  }
}

class UmamiAnalyticsProvider implements AnalyticsProvider {
  private isInitialized = false;
  private currentUserId: string | undefined;

  public async trackPageView(): Promise<void> {
    // Umami has automatic page view tracking
    return Promise.resolve();
  }

  public async trackEvent(
    eventName: string,
    eventProperties: Record<string, string | string[]> = {}
  ): Promise<void> {
    await this.initialize();

    const processedProperties: Record<string, string> = {};
    Object.entries(eventProperties).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedProperties[key] = value.join(',');
      } else {
        processedProperties[key] = value;
      }
    });

    if (this.currentUserId) {
      processedProperties.user_id = this.currentUserId;
    }

    this.getUmami().track(eventName, processedProperties);
  }

  public async identify(userId: string): Promise<void> {
    await this.initialize();
    this.currentUserId = userId;
  }

  private getUmami() {
    return typeof window === 'undefined' || !window.umami
      ? {
          track: () => {}
        }
      : window.umami;
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    const host = keys().NEXT_PUBLIC_ANALYTICS_UMAMI_HOST;
    if (!host) {
      throw new Error(
        'Host is not set. Please set the environment variable NEXT_PUBLIC_ANALYTICS_UMAMI_HOST.'
      );
    }

    const websiteId = keys().NEXT_PUBLIC_ANALYTICS_UMAMI_WEBSITE_ID;
    if (!websiteId) {
      throw new Error(
        'Website ID is not set. Please set the environment variable NEXT_PUBLIC_ANALYTICS_UMAMI_WEBSITE_ID.'
      );
    }

    if (keys().NEXT_PUBLIC_ANALYTICS_UMAMI_DISABLE_LOCALHOST_TRACKING) {
      this.disableLocalhostTracking();
    }

    await this.createUmamiScript(host, websiteId);
    this.isInitialized = true;
  }

  private disableLocalhostTracking(): void {
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
        localStorage.setItem('umami.disabled', '1');
      }
    }
  }

  private createUmamiScript(host: string, websiteId: string): Promise<void> {
    if (typeof document === 'undefined') {
      return Promise.resolve();
    }

    const script = document.createElement('script');
    script.src = host;
    script.async = true;
    script.defer = true;

    script.setAttribute('data-website-id', websiteId);
    document.head.appendChild(script);

    return new Promise<void>((resolve) => {
      script.onload = () => {
        resolve();
      };
    });
  }
}

export default new UmamiAnalyticsProvider();
