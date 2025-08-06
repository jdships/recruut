import { type NextRequest, NextResponse } from "next/server";

// pages/api/input.js
const a = 10;

export async function POST(req: NextRequest) {
	const data = await req.json();
	console.log(data);
	return NextResponse.json(a);
}
