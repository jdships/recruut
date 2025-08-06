"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_RESEND_API_KEY);

export async function sendContactMessage({
	firstName,
	lastName,
	email,
	message,
}: {
	firstName: string;
	lastName: string;
	email: string;
	message: string;
}) {
	if (!firstName || !lastName || !email || !message) {
		return { success: false, message: "All fields are required." };
	}
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email)) {
		return { success: false, message: "Please enter a valid email address." };
	}
	try {
		await resend.emails.send({
			from: process.env.EMAIL_FROM!,
			to: process.env.EMAIL_FROM!, // send to site admin for now
			subject: `New Contact Form Submission from ${firstName} ${lastName}`,
			html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, "<br/>")}</p>`,
		});
		return { success: true };
	} catch (error: unknown) {
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Failed to send message.",
		};
	}
}
