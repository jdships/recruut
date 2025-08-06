import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  RevokedInvitationEmail,
  type RevokedInvitationEmailProps
} from './templates/revoked-invitation-email';

export async function sendRevokedInvitationEmail(
  input: RevokedInvitationEmailProps & { recipient: string }
): Promise<void> {
  const component = RevokedInvitationEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Invitation revoked',
    html,
    text
  });
}
