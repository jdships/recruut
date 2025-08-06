'use server';

import { returnValidationErrors } from 'next-safe-action';

import { signIn } from '@workspace/auth';
import { CredentialsSignin } from '@workspace/auth/errors';
import { Provider } from '@workspace/auth/providers.types';
import { getRedirectAfterSignIn } from '@workspace/auth/redirect';

import { actionClient } from '~/actions/safe-action';
import { passThroughCredentialsSchema } from '~/schemas/auth/pass-through-credentials-schema';

export const signInWithCredentials = actionClient
  .metadata({ actionName: 'signInWithCredentials' })
  .inputSchema(passThroughCredentialsSchema)
  .action(async ({ parsedInput }) => {
    const redirectTo = await getRedirectAfterSignIn();

    // Expected UX for log in is to pass the credentials through
    // and not validate them on the client-side.
    try {
      await signIn(Provider.Credentials, {
        ...parsedInput,
        redirectTo,
        redirect: true
      });
    } catch (e) {
      if (e instanceof CredentialsSignin) {
        return returnValidationErrors(passThroughCredentialsSchema, {
          _errors: [e.code]
        });
      }
      throw e;
    }
  });
