'use server';

import { returnValidationErrors } from 'next-safe-action';

import { signIn } from '@workspace/auth';
import { CredentialsSignin } from '@workspace/auth/errors';
import { Provider } from '@workspace/auth/providers.types';
import { getRedirectAfterSignIn } from '@workspace/auth/redirect';

import { actionClient } from '~/actions/safe-action';
import { submitTotpCodeSchema } from '~/schemas/auth/submit-totp-code-schema';

export const submitTotpCode = actionClient
  .metadata({ actionName: 'submitTotpCode' })
  .inputSchema(submitTotpCodeSchema)
  .action(async ({ parsedInput }) => {
    const redirectTo = await getRedirectAfterSignIn();

    try {
      await signIn(Provider.TotpCode, {
        ...parsedInput,
        redirectTo,
        redirect: true
      });
    } catch (e) {
      if (e instanceof CredentialsSignin) {
        return returnValidationErrors(submitTotpCodeSchema, {
          _errors: [e.code]
        });
      }
      throw e;
    }
  });
