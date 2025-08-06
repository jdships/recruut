import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db } from '@workspace/database/client';
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTokenTable
} from '@workspace/database/schema';

// Here we could modify the DrizzleAdapter, i.e. overwrite the createUser() method.
// Suggestion is to keep the adapter as it is and try to work around it or else you might need to adjust with each update.

export const adapter = Object.freeze(
  DrizzleAdapter(db, {
    usersTable: userTable,
    accountsTable: accountTable,
    sessionsTable: sessionTable,
    verificationTokensTable: verificationTokenTable
  })
);
