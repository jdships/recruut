export type ErrorRequest = {
  path: string;
  method: string;
  headers: NodeJS.Dict<string | string[]>;
};

export type ErrorContext = {
  routerKind: 'Pages Router' | 'App Router';
  routePath: string;
  routeType: 'render' | 'route' | 'action' | 'middleware';
  renderSource?:
    | 'react-server-components'
    | 'react-server-components-payload'
    | 'server-rendering';
  revalidateReason: 'on-demand' | 'stale' | undefined;
};

export type MonitoringProvider = {
  withConfig<C>(nextConfig: C): C;
  register(): Promise<void>;
  captureRequestError(
    error: unknown,
    errorRequest: Readonly<ErrorRequest>,
    errorContext: Readonly<ErrorContext>
  ): void | Promise<void>;
  captureError(error: unknown): void;
  captureEvent<Extra extends object>(event: string, extra?: Extra): void;
  setUser<Info extends { id: string }>(user: Info): void;
};
