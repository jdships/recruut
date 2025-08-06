/**
 * Simple Polar.sh webhook handler
 * Handles subscription updates and plan changes
 */

import { db, eq } from "@workspace/database/client";
import { organizationTable } from "@workspace/database/schema";
import { type NextRequest, NextResponse } from "next/server";
import type { PlanType } from "~/lib/plans";

// Types for Polar webhook data
type WebhookMetadata = {
	organizationId?: string;
	plan?: string;
};

type WebhookData = {
	metadata?: WebhookMetadata;
	customerId?: string;
	currentPeriodEnd?: string;
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const signature = request.headers.get("polar-webhook-signature");

		if (!signature) {
			return NextResponse.json(
				{ error: "Missing webhook signature" },
				{ status: 400 },
			);
		}

		// TODO: Verify webhook signature
		// This would involve validating the signature with Polar's webhook secret
		// For now, we'll process the webhook without verification (NOT for production)

		const event = JSON.parse(body);
		console.log("Received Polar webhook:", event.type);

		switch (event.type) {
			case "checkout.completed":
				await handleCheckoutCompleted(event.data);
				break;

			case "subscription.created":
				await handleSubscriptionCreated(event.data);
				break;

			case "subscription.updated":
				await handleSubscriptionUpdated(event.data);
				break;

			case "subscription.cancelled":
				await handleSubscriptionCancelled(event.data);
				break;

			case "payment.succeeded":
				await handlePaymentSucceeded(event.data);
				break;

			case "payment.failed":
				await handlePaymentFailed(event.data);
				break;

			default:
				console.log(`Unhandled webhook event type: ${event.type}`);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Webhook processing failed:", error);
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 500 },
		);
	}
}

async function handleCheckoutCompleted(data: WebhookData) {
	console.log("Processing checkout completion:", data);

	const { metadata } = data;
	if (!metadata?.organizationId || !metadata?.plan) {
		console.warn("Missing metadata in checkout completion");
		return;
	}

	// Update organization plan
	await updateOrganizationPlan(
		metadata.organizationId,
		metadata.plan as PlanType,
		data.customerId,
	);
}

async function handleSubscriptionCreated(data: WebhookData) {
	console.log("Processing subscription creation:", data);

	// Extract organization info from metadata
	const { metadata } = data;
	if (!metadata?.organizationId || !metadata?.plan) {
		console.warn("Missing metadata in subscription creation");
		return;
	}

	// Update organization plan and set expiry
	await updateOrganizationPlan(
		metadata.organizationId,
		metadata.plan as PlanType,
		data.customerId,
		data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : undefined,
	);
}

async function handleSubscriptionUpdated(data: WebhookData) {
	console.log("Processing subscription update:", data);
	// Handle subscription changes, renewals, etc.

	const { metadata } = data;
	if (!metadata?.organizationId) {
		console.warn("Missing organization ID in subscription update");
		return;
	}

	// Update expiry date
	if (data.currentPeriodEnd) {
		await db
			.update(organizationTable)
			.set({
				planExpiresAt: new Date(data.currentPeriodEnd),
			})
			.where(eq(organizationTable.id, metadata.organizationId));
	}
}

async function handleSubscriptionCancelled(data: WebhookData) {
	console.log("Processing subscription cancellation:", data);

	const { metadata } = data;
	if (!metadata?.organizationId) {
		console.warn("Missing organization ID in subscription cancellation");
		return;
	}

	// When cancelled, they keep access until period end
	// The expiry checker will revert them to free when the time comes
	console.log(
		`Subscription cancelled for organization ${metadata.organizationId}, access until ${data.currentPeriodEnd}`,
	);
}

async function handlePaymentSucceeded(data: WebhookData) {
	console.log("Processing successful payment:", data);
	// Could be used for notifications, analytics, etc.
}

async function handlePaymentFailed(data: WebhookData) {
	console.log("Processing failed payment:", data);
	// Could be used for notifications, retry logic, etc.
}

async function updateOrganizationPlan(
	organizationId: string,
	plan: PlanType,
	billingCustomerId?: string,
	expiresAt?: Date,
) {
	try {
		const updateData: Partial<typeof organizationTable.$inferInsert> = {
			plan,
		};

		if (billingCustomerId) {
			updateData.billingCustomerId = billingCustomerId;
		}

		if (expiresAt) {
			updateData.planExpiresAt = expiresAt;
		}

		await db
			.update(organizationTable)
			.set(updateData)
			.where(eq(organizationTable.id, organizationId));

		console.log(`Updated organization ${organizationId} to ${plan} plan`);
	} catch (error) {
		console.error("Failed to update organization plan:", error);
		throw error;
	}
}
