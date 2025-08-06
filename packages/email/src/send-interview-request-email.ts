import { render } from "@react-email/render";

import { EmailProvider } from "./provider";
import {
	InterviewRequestEmail,
	type InterviewRequestEmailProps,
} from "./templates/interview-request-email";

export async function sendInterviewRequestEmail(
	input: InterviewRequestEmailProps & { recipient: string },
): Promise<void> {
	const component = InterviewRequestEmail(input);
	const html = await render(component);
	const text = await render(component, { plainText: true });

	await EmailProvider.sendEmail({
		recipient: input.recipient,
		subject: `🎉 Interview Invitation - ${input.positionTitle} at ${input.organizationName}`,
		html,
		text,
	});
}
