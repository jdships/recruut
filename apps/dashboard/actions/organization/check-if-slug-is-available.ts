'use server';

import { count, db, eq } from '@workspace/database/client';
import { organizationTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { checkIfSlugIsAvailableSchema } from '~/schemas/organization/check-if-slug-is-available-schema';

export const checkIfSlugIsAvailable = authActionClient
  .metadata({ actionName: 'checkIfSlugIsAvailable' })
  .inputSchema(checkIfSlugIsAvailableSchema)
  .action(async ({ parsedInput }) => {
    const isAvailable = await db
      .select({ count: count() })
      .from(organizationTable)
      .where(eq(organizationTable.slug, parsedInput.slug))
      .then((result) => result[0].count === 0);

    return { isAvailable };
  });
