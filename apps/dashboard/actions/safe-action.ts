import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE
} from 'next-safe-action';
import { z } from 'zod';

import {
  getAuthContext,
  getAuthOrganizationContext
} from '@workspace/auth/context';
import {
  ForbiddenError,
  NotFoundError,
  PreConditionError,
  ValidationError
} from '@workspace/common/errors';

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (
      e instanceof ValidationError ||
      e instanceof ForbiddenError ||
      e instanceof NotFoundError ||
      e instanceof PreConditionError
    ) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string()
    });
  }
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const ctx = await getAuthContext();

  return next({ ctx });
});

export const authOrganizationActionClient = actionClient.use(
  async ({ next }) => {
    const ctx = await getAuthOrganizationContext();

    return next({ ctx });
  }
);
