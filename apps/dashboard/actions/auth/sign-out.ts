'use server';

import { signOut as NextSignOut } from '@workspace/auth';
import { routes } from '@workspace/routes';

import { actionClient } from '~/actions/safe-action';
import { signOutSchema } from '~/schemas/auth/sign-out-schema';

export const signOut = actionClient
  .metadata({ actionName: 'signOut' })
  .inputSchema(signOutSchema)
  .action(async ({ parsedInput }) => {
    return await NextSignOut({
      redirect: parsedInput.redirect,
      redirectTo: parsedInput.redirect
        ? routes.dashboard.auth.SignIn
        : undefined
    });
  });
