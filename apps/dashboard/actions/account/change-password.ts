'use server';

import { revalidatePath } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';

import { hashPassword, verifyPassword } from '@workspace/auth/password';
import { NotFoundError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { userTable } from '@workspace/database/schema';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { changePasswordSchema } from '~/schemas/account/change-password-schema';

export const changePassword = authOrganizationActionClient
  .metadata({ actionName: 'changePassword' })
  .inputSchema(changePasswordSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [user] = await db
      .select({
        password: userTable.password
      })
      .from(userTable)
      .where(eq(userTable.id, ctx.session.user.id))
      .limit(1);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.password) {
      const passwordsMatch = await verifyPassword(
        parsedInput.currentPassword ?? '',
        user.password
      );
      if (!passwordsMatch) {
        return returnValidationErrors(changePasswordSchema, {
          currentPassword: {
            _errors: ['Current password is not correct.']
          }
        });
      }
    }
    if (parsedInput.currentPassword === parsedInput.newPassword) {
      return returnValidationErrors(changePasswordSchema, {
        newPassword: {
          _errors: [
            'New password matches your old password. Please choose a different password.'
          ]
        }
      });
    }

    const password = await hashPassword(parsedInput.newPassword);

    await db
      .update(userTable)
      .set({ password })
      .where(eq(userTable.id, ctx.session.user.id));

    revalidatePath(
      replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.account.Security,
        ctx.organization.slug
      )
    );
  });
