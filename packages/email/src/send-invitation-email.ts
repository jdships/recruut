import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  InvitationEmail,
  type InvitationEmailProps
} from './templates/invitation-email';

export async function sendInvitationEmail(
  input: InvitationEmailProps & { recipient: string }
): Promise<void> {
  const component = InvitationEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'Organization invitation',
    html,
    text
  });
}
