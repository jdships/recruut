import { and, arrayContains, db, eq } from "@workspace/database/client";
import { type WebhookTrigger, webhookTable } from "@workspace/database/schema";

import { sendPayload } from "./send-payload";

// In the beginning, just call this method whenever an event occurs,
// but ideally you want to call webhooks in a separate worker process.

export async function callWebhooks<T>(
	organizationId: string,
	trigger: WebhookTrigger,
	payload: T,
) {
	const webhooks = await db
		.select({
			id: webhookTable.id,
			url: webhookTable.url,
			triggers: webhookTable.triggers,
			secret: webhookTable.secret,
		})
		.from(webhookTable)
		.where(
			and(
				eq(webhookTable.organizationId, organizationId),
				arrayContains(webhookTable.triggers, [trigger]),
			),
		)
		.orderBy(webhookTable.createdAt);

	for (const webhook of webhooks) {
		let retryCount = 0;
		const MAX_RETRY_COUNT = 3;
		while (retryCount < MAX_RETRY_COUNT) {
			retryCount++;
			try {
				console.log("SENDING webhook payload");
				const response = await sendPayload<T>(webhook, trigger, payload);
				console.log("SENT webhook payload");
				if (response.ok) {
					console.log("SUCCESS webhook payload");
					break;
				}
				console.log("FAILED webhook payload");
			} catch (e) {
				console.error(
					`Error executing webhook ${webhook.id} for event: ${trigger}, URL: ${webhook.url}`,
					e,
				);
			}
		}
	}
}
