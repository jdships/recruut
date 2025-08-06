'use server';

import { cookies } from 'next/headers';
import { returnValidationErrors } from 'next-safe-action';

import { signIn } from '@workspace/auth';
import { AuthCookies } from '@workspace/auth/cookies';
import { CredentialsSignin } from '@workspace/auth/errors';
import { Provider } from '@workspace/auth/providers.types';
import { submitRecoveryCodeSchema } from '@workspace/auth/schemas';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';

export const submitRecoveryCode = actionClient
  .metadata({ actionName: 'submitRecoveryCode' })
  .inputSchema(submitRecoveryCodeSchema)
  .action(async ({ parsedInput }) => {
    const cookieStore = await cookies();
    const callbackUrl =
      cookieStore.get(AuthCookies.CallbackUrl)?.value ||
      routes.dashboard.organizations.Index;

    try {
      await signIn(Provider.RecoveryCode, {
        ...parsedInput,
        redirectTo: callbackUrl,
        redirect: true
      });
    } catch (e) {
      if (e instanceof CredentialsSignin) {
        return returnValidationErrors(submitRecoveryCodeSchema, {
          _errors: [e.code]
        });
      }
      throw e;
    }
  });
