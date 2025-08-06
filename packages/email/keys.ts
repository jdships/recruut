import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
	createEnv({
		server: {
			EMAIL_FROM: z.string(), // You can use 'Recruut <noreply@mailer.recruut.io>'
			EMAIL_FEEDBACK_INBOX: z.string().email().optional(),
			EMAIL_NODEMAILER_URL: z.string().optional(),
			EMAIL_POSTMARK_SERVER_TOKEN: z.string().optional(),
			EMAIL_RESEND_API_KEY: z.string().optional(),
			EMAIL_SENDGRID_API_KEY: z.string().optional(),
		},
		runtimeEnv: {
			EMAIL_FROM: process.env.EMAIL_FROM,
			EMAIL_FEEDBACK_INBOX: process.env.EMAIL_FEEDBACK_INBOX,
			EMAIL_NODEMAILER_URL: process.env.EMAIL_NODEMAILER_URL,
			EMAIL_POSTMARK_SERVER_TOKEN: process.env.EMAIL_POSTMARK_SERVER_TOKEN,
			EMAIL_RESEND_API_KEY: process.env.EMAIL_RESEND_API_KEY,
			EMAIL_SENDGRID_API_KEY: process.env.EMAIL_SENDGRID_API_KEY,
		},
	});
