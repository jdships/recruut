/**
 * Simple Polar.sh checkout using @polar-sh/nextjs adapter
 * Following the "5 lines of code" integration pattern
 */

import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	successUrl: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/billing/success`,
});
