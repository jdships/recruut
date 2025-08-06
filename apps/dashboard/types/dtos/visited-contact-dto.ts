import { type ContactRecord } from '@workspace/database/schema';

export type VisitedContactDto = {
  id: string;
  name: string;
  image?: string;
  record: ContactRecord;
  pageVisits: number;
};
