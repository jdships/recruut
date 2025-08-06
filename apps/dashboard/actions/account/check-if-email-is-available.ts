'use server';

import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { checkIfEmailIsAvailableSchema } from '~/schemas/account/check-if-email-is-available-schema';

export const checkIfEmailIsAvailable = authActionClient
  .metadata({ actionName: 'checkIfEmailIsAvailable' })
  .inputSchema(checkIfEmailIsAvailableSchema)
  .action(async ({ parsedInput }) => {
    const normalizedEmail = parsedInput.email.toLowerCase();
    const [user] = await db
      .select({})
      .from(userTable)
      .where(eq(userTable.email, normalizedEmail))
      .limit(1);

    return { isAvailable: user ? false : true };
  });
