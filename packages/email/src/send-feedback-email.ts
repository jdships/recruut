import { render } from '@react-email/render';

import { EmailProvider } from './provider';
import {
  FeedbackEmail,
  type FeedbackEmailProps
} from './templates/feedback-email';

export async function sendFeedbackEmail(
  input: FeedbackEmailProps & { recipient: string }
): Promise<void> {
  const component = FeedbackEmail(input);
  const html = await render(component);
  const text = await render(component, { plainText: true });

  await EmailProvider.sendEmail({
    recipient: input.recipient,
    subject: 'User Feedback',
    html,
    text,
    replyTo: input.email
  });
}
