import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get("file") as File;
	if (!file) {
		return NextResponse.json({ error: "No file provided" }, { status: 400 });
	}
	try {
		const blob = await put(file.name, file, {
			access: "public",
			addRandomSuffix: true,
		});
		return NextResponse.json({ url: blob.url });
	} catch (err) {
		return NextResponse.json(
			{ error: (err as Error).message },
			{ status: 500 },
		);
	}
}
