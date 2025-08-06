'use server';

import { authenticator } from 'otplib';
import qrcode from 'qrcode';

import { APP_NAME } from '@workspace/common/app';

import { authActionClient } from '~/actions/safe-action';

export const generateTotpSetupData = authActionClient
  .metadata({ actionName: 'generateTotpSetupData' })
  .action(async ({ ctx }) => {
    const secret = authenticator.generateSecret(20);
    const accountName = ctx.session.user.email;
    const issuer = APP_NAME;
    const keyUri = authenticator.keyuri(accountName, issuer, secret);
    const dataUri = await qrcode.toDataURL(keyUri, {
      errorCorrectionLevel: 'low'
    });

    return { accountName, issuer, secret, keyUri, dataUri };
  });
