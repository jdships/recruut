import { ContactTaskStatus } from '@workspace/database/schema';

export type ContactTaskDto = {
  id: string;
  contactId?: string;
  title: string;
  description?: string;
  status: ContactTaskStatus;
  dueDate?: Date;
  createdAt: Date;
};
