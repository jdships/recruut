import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  ConfirmEmailAddressChangeEmail,
  type ConfirmEmailAddressChangeEmailProps
} from './templates/confirm-email-address-change-email';

export async function sendConfirmEmailAddressChangeEmail(
  input: ConfirmEmailAddressChangeEmailProps & { recipient: string }
): Promise<void> {
  const component = ConfirmEmailAddressChangeEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Change email instructions',
    html,
    text
  });
}
