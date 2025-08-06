import { OAuthProvider } from '@workspace/auth/providers.types';

export type ConnectedAccountDto = {
  id: OAuthProvider;
  name: string;
  type: string;
  linked: boolean;
};
