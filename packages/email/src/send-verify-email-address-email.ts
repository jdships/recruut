import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  VerifyEmailAddressEmail,
  type VerifyEmailAddressEmailProps
} from './templates/verify-email-address-email';

export async function sendVerifyEmailAddressEmail(
  input: VerifyEmailAddressEmailProps & { recipient: string }
): Promise<void> {
  const component = VerifyEmailAddressEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Verify email address',
    html,
    text
  });
}
