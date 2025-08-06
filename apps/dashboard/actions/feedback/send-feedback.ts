'use server';

import { APP_NAME } from '@workspace/common/app';
import { db } from '@workspace/database/client';
import { feedbackTable } from '@workspace/database/schema';
import { sendFeedbackEmail } from '@workspace/email/send-feedback-email';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { env } from '~/env';
import { feedbackCategoryLabels } from '~/lib/labels';
import { sendFeedbackSchema } from '~/schemas/feedback/send-feedback-schema';

export const sendFeedback = authOrganizationActionClient
  .metadata({ actionName: 'sendFeedback' })
  .inputSchema(sendFeedbackSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.insert(feedbackTable).values({
      category: parsedInput.category,
      message: parsedInput.message,
      organizationId: ctx.organization.id,
      userId: ctx.session.user.id
    });

    if (!env.EMAIL_FEEDBACK_INBOX) {
      console.warn('Missing EMAIL_FEEDBACK_INBOX environment variable');
      return;
    }

    await sendFeedbackEmail({
      recipient: env.EMAIL_FEEDBACK_INBOX,
      appName: APP_NAME,
      organizationName: ctx.organization.name,
      name: ctx.session.user.name,
      email: ctx.session.user.email,
      category: feedbackCategoryLabels[parsedInput.category],
      message: parsedInput.message
    });
  });
