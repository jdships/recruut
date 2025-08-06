import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  PasswordResetEmail,
  type PasswordResetEmailProps
} from './templates/password-reset-email';

export async function sendPasswordResetEmail(
  input: PasswordResetEmailProps & { recipient: string }
): Promise<void> {
  const component = PasswordResetEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Reset password instructions',
    html,
    text
  });
}
