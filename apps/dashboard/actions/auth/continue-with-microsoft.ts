'use server';

import { signIn } from '@workspace/auth';
import { Provider } from '@workspace/auth/providers.types';
import { getRedirectAfterSignIn } from '@workspace/auth/redirect';

import { actionClient } from '~/actions/safe-action';

export const continueWithMicrosoft = actionClient
  .metadata({ actionName: 'continueWithMicrosoft' })
  .action(async () => {
    const redirectTo = await getRedirectAfterSignIn();

    await signIn(
      Provider.MicrosoftEntraId,
      {
        redirectTo,
        redirect: true
      },
      {
        prompt: 'login'
      }
    );
  });
