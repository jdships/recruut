import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  ConnectedAccountSecurityAlertEmail,
  type ConnectedAccountSecurityAlertEmailProps
} from './templates/connected-account-security-alert-email';

export async function sendConnectedAccountSecurityAlertEmail(
  input: ConnectedAccountSecurityAlertEmailProps & { recipient: string }
): Promise<void> {
  const component = ConnectedAccountSecurityAlertEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Security Alert!',
    html,
    text
  });
}
