"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_RESEND_API_KEY);

export async function submitGetStarted({
	name,
	email,
	companySize,
}: {
	name: string;
	email: string;
	companySize: string;
}) {
	if (!name || !email || !companySize) {
		return { success: false, message: "All fields are required." };
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email)) {
		return { success: false, message: "Please enter a valid email address." };
	}

	const emailFrom = process.env.EMAIL_FROM;
	if (!emailFrom) {
		return { success: false, message: "Email configuration error." };
	}

	// Convert company size to readable format
	const companySizeLabels: Record<string, string> = {
		"just-me": "Just me",
		"1-5": "1-5 employees",
		"5-10": "5-10 employees",
		"10-50": "10-50 employees",
		"50+": "50+ employees",
	};
	const companySizeLabel = companySizeLabels[companySize] || companySize;

	try {
		// Send notification to your team
		await resend.emails.send({
			from: emailFrom,
			to: "hello@recruut.io", // send to your team
			subject: `New Get Started Request from ${name}`,
			html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Company Size:</strong> ${companySizeLabel}</p>
             <p>Someone is interested in getting started with Recruut!</p>`,
		});

		// Send welcome email to the user
		await resend.emails.send({
			from: emailFrom,
			to: email,
			subject: "Welcome to Recruut - Let's Get Started!",
			html: `<p>Hi ${name},</p>
             <p>Thanks for your interest in Recruut! We're excited to help you revolutionize your recruitment process.</p>
             <p>Our team will be in touch with you soon to help you get started.</p>
             <p>Best regards,<br/>The Recruut Team</p>`,
		});

		return { success: true, message: "Thank you! We'll be in touch soon." };
	} catch (error) {
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Failed to submit request.",
		};
	}
}
