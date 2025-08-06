import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
	const { to, subject, html } = await request.json();

	const from = process.env.EMAIL_FROM;
	if (!from) throw new Error("EMAIL_FROM environment variable is not set");

	try {
		const data = await resend.emails.send({
			from,
			to,
			subject,
			html,
		});

		return NextResponse.json({ success: true, data });
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
