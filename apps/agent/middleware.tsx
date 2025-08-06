import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
	type NextFetchEvent,
	type NextRequest,
	NextResponse,
} from "next/server";

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(10, "1 s"),
});

export default async function middleware(
	request: NextRequest,
	_event: NextFetchEvent,
): Promise<Response | undefined> {
	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		request.headers.get("x-real-ip") ||
		"127.0.0.1";
	const { success } = await ratelimit.limit(ip);
	return success
		? NextResponse.next()
		: NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
	matcher: "/",
};
