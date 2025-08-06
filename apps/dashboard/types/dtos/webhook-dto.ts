import { type WebhookTrigger } from '@workspace/database/schema';

export type WebhookDto = {
  id: string;
  url: string;
  triggers: WebhookTrigger[];
  secret?: string;
};
