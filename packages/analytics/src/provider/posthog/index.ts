import type { PostHog as ClientPostHog } from 'posthog-js';
import type { PostHog as ServerPostHog } from 'posthog-node';

import { keys } from '../../../keys';
import type { AnalyticsProvider } from '../types';

class PostHogAnalyticsProvider implements AnalyticsProvider {
  private clientPostHog: ClientPostHog | undefined;
  private serverPostHog: ServerPostHog | undefined;
  private userId: string | undefined;
  private isInitialized = false;

  public async identify(
    userIdentifier: string,
    traits?: Record<string, string>
  ): Promise<void> {
    await this.initialize();
    this.userId = userIdentifier;

    if (this.isClient()) {
      const client = await this.initializeOrGetClientPostHog();
      client.identify(userIdentifier, traits);
    } else {
      const server = await this.initializeOrGetServerPostHog();
      server.capture({
        event: '$identify',
        distinctId: userIdentifier,
        properties: traits
      });
    }
  }

  public async trackPageView(url: string): Promise<void> {
    await this.initialize();

    if (this.isClient()) {
      const client = await this.initializeOrGetClientPostHog();
      client.capture('$pageview', { $current_url: url });
    } else {
      if (!this.userId) {
        throw new Error(
          `Please identify the user using the identify method before tracking page views`
        );
      }
      const server = await this.initializeOrGetServerPostHog();
      server.capture({
        event: '$pageview',
        distinctId: this.userId,
        properties: { $current_url: url }
      });
    }
  }

  public async trackEvent(
    eventName: string,
    eventProperties?: Record<string, string | string[]>
  ): Promise<void> {
    await this.initialize();

    if (this.isClient()) {
      const client = await this.initializeOrGetClientPostHog();
      client.capture(eventName, eventProperties);
    } else {
      if (!this.userId) {
        throw new Error(
          `Please identify the user using the identify method before tracking events`
        );
      }
      const server = await this.initializeOrGetServerPostHog();
      server.capture({
        event: eventName,
        distinctId: this.userId,
        properties: eventProperties
      });
    }
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;
    if (!posthogKey) {
      throw new Error('PostHog key not provided, skipping initialization');
    }

    const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST;
    if (!posthogHost) {
      throw new Error('PostHog host not provided, skipping initialization');
    }

    if (this.isClient()) {
      await this.initializeOrGetClientPostHog();
    } else {
      await this.initializeOrGetServerPostHog();
    }
    this.isInitialized = true;
  }

  private async initializeOrGetServerPostHog(): Promise<ServerPostHog> {
    if (!this.serverPostHog) {
      const { PostHog } = await import('posthog-node');

      const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST!;
      const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;

      this.serverPostHog = new PostHog(posthogKey, {
        host: posthogHost,
        flushAt: 1,
        flushInterval: 0
      });
    }
    return this.serverPostHog;
  }

  private async initializeOrGetClientPostHog(): Promise<ClientPostHog> {
    if (!this.clientPostHog) {
      const { posthog } = await import('posthog-js');

      const posthogKey = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_KEY!;
      const posthogHost = keys().NEXT_PUBLIC_ANALYTICS_POSTHOG_HOST!;

      posthog.init(posthogKey, {
        api_host: posthogHost,
        ui_host: posthogHost,
        persistence: 'localStorage+cookie',
        person_profiles: 'always',
        capture_pageview: false,
        capture_pageleave: true
      });
      this.clientPostHog = posthog;
    }
    return this.clientPostHog;
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }
}

export default new PostHogAnalyticsProvider();
