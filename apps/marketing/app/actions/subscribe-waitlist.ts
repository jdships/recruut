"use server";

import { Resend } from "resend";
import { z } from "zod";
import { env } from "~/env";

// Initialize Resend only if API key is available
const resend = env.EMAIL_RESEND_API_KEY
	? new Resend(env.EMAIL_RESEND_API_KEY)
	: null;

const waitlistSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	firstName: z.string().min(1, "First name is required").optional(),
	lastName: z.string().min(1, "Last name is required").optional(),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;

export async function subscribeWaitlist(data: WaitlistFormData) {
	try {
		// Check if Resend is configured
		if (!resend || !env.EMAIL_FROM || !env.RESEND_AUDIENCE_ID) {
			return {
				success: false,
				message: "Waitlist is not configured yet. Please try again later.",
			};
		}

		// Validate the input data
		const validatedData = waitlistSchema.parse(data);

		// Check if contact already exists
		const existingContact = await resend.contacts.get({
			email: validatedData.email,
			audienceId: env.RESEND_AUDIENCE_ID,
		});

		// If contact exists and is not unsubscribed, return early
		if (existingContact.data && !existingContact.data.unsubscribed) {
			return {
				success: true,
				message: "You have already requested access. We'll keep you updated.",
			};
		}

		// Add contact to the waitlist audience
		await resend.contacts.create({
			email: validatedData.email,
			firstName: validatedData.firstName || undefined,
			lastName: validatedData.lastName || undefined,
			unsubscribed: false,
			audienceId: env.RESEND_AUDIENCE_ID,
		});

		// Send welcome email
		await resend.emails.send({
			from: env.EMAIL_FROM,
			to: validatedData.email,
			subject: "Thanks for requesting access! 🚀",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<h2>Thanks for requesting access!</h2>
					<p>Hi${validatedData.firstName ? ` ${validatedData.firstName}` : ""},</p>
					<p>We're excited to have you on our waitlist for the future of AI-powered recruiting.</p>
					<p>Here's what happens next:</p>
					<ul>
						<li>We'll keep you updated on our progress</li>
						<li>You'll be among the first to know when we launch</li>
						<li>You'll get exclusive early access and special pricing</li>
					</ul>
					<p>Best regards,<br>The Recruut Team</p>
				</div>
			`,
		});

		return {
			success: true,
			message:
				"Successfully requested access! Check your email for confirmation.",
		};
	} catch (error: unknown) {
		console.error("Waitlist subscription error:", error);

		// Handle validation errors
		if (error instanceof z.ZodError) {
			return {
				success: false,
				message: error.errors[0]?.message || "Invalid input data",
			};
		}

		// Handle Resend API errors
		if (error instanceof Error && error.message.includes("already exists")) {
			return {
				success: true,
				message: "You have already requested access. We'll keep you updated.",
			};
		}

		return {
			success: false,
			message: "Failed to request access. Please try again later.",
		};
	}
}
