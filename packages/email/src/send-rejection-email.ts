import { render } from "@react-email/render";

import { EmailProvider } from "./provider";
import {
	RejectionEmail,
	type RejectionEmailProps,
} from "./templates/rejection-email";

export async function sendRejectionEmail(
	input: RejectionEmailProps & { recipient: string },
): Promise<void> {
	const component = RejectionEmail(input);
	const html = await render(component);
	const text = await render(component, { plainText: true });

	await EmailProvider.sendEmail({
		recipient: input.recipient,
		subject: `Thank you for your application - ${input.positionTitle} at ${input.organizationName}`,
		html,
		text,
	});
}
