'use server';

import { checkIfCanInvite } from '@workspace/auth/invitations';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { checkIfCanBeInvitedSchema } from '~/schemas/invitations/check-if-can-be-invited-schema';

export const checkIfCanBeInvited = authOrganizationActionClient
  .metadata({ actionName: 'checkIfCanBeInvited' })
  .inputSchema(checkIfCanBeInvitedSchema)
  .action(async ({ parsedInput, ctx }) => {
    const normalizedEmail = parsedInput.email.toLowerCase();
    const canInvite = await checkIfCanInvite(
      normalizedEmail,
      ctx.organization.id
    );

    return { canInvite };
  });
