import { type ContactRecord } from '@workspace/database/schema';

export type FavoriteDto = {
  id: string;
  order: number;
  contactId: string;
  name: string;
  record: ContactRecord;
  image?: string;
};
