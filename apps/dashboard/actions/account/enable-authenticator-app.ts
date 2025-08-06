'use server';

import crypto from 'crypto';
import { revalidateTag } from 'next/cache';
import { returnValidationErrors } from 'next-safe-action';
import { authenticator } from 'otplib';

import { symmetricEncrypt } from '@workspace/auth/encryption';
import { PreConditionError } from '@workspace/common/errors';
import { db, eq } from '@workspace/database/client';
import { authenticatorAppTable } from '@workspace/database/schema';

import { authActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';
import { env } from '~/env';
import { enableAuthenticatorAppSchema } from '~/schemas/account/enable-authenticator-app-schema';

export const enableAuthenticatorApp = authActionClient
  .metadata({ actionName: 'enableAuthenticatorApp' })
  .inputSchema(enableAuthenticatorAppSchema)
  .action(async ({ parsedInput, ctx }) => {
    const isValidToken = authenticator.check(
      parsedInput.totpCode,
      parsedInput.secret
    );
    if (!isValidToken) {
      return returnValidationErrors(enableAuthenticatorAppSchema, {
        totpCode: {
          _errors: ['The entered code is not valid.']
        }
      });
    }

    const [authenticatorApp] = await db
      .select({})
      .from(authenticatorAppTable)
      .where(eq(authenticatorAppTable.userId, ctx.session.user.id))
      .limit(1);

    if (authenticatorApp) {
      throw new PreConditionError('Authenticator app is already enabled');
    }

    const recoveryCodes = Array.from(Array(10), () =>
      crypto.randomBytes(5).toString('hex')
    );

    const key = env.AUTH_SECRET;
    await db.insert(authenticatorAppTable).values({
      userId: ctx.session.user.id,
      accountName: parsedInput.accountName,
      issuer: parsedInput.issuer,
      secret: symmetricEncrypt(parsedInput.secret, key),
      recoveryCodes: symmetricEncrypt(JSON.stringify(recoveryCodes), key)
    });

    revalidateTag(
      Caching.createUserTag(
        UserCacheKey.MultiFactorAuthentication,
        ctx.session.user.id
      )
    );

    return { recoveryCodes };
  });
