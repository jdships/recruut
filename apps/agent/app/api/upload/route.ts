import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const formData = await req.formData();
	const uuid = formData.get("uuid") as string;
	const file = formData.get("file") as File;

	if (!file) {
		return NextResponse.json({ error: "No files received." }, { status: 400 });
	}

	const filename = `${uuid}.pdf`;
	try {
		// Upload to Vercel Blob
		const blob = await put(filename, file, { access: "public" });
		return NextResponse.json({
			Message: "Success",
			status: 201,
			fileUrl: blob.url,
		});
	} catch (error) {
		console.log("Error occurred ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
};
