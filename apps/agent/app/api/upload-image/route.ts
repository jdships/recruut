import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const formData = await req.formData();
	const uuid = formData.get("uuid") as string;
	const file = formData.get("file") as File;

	if (!file) {
		return NextResponse.json({ error: "No files received." }, { status: 400 });
	}

	const fileExtension = file.name.split(".").pop()?.toLowerCase();
	const filename = `${uuid}-headshot.${fileExtension}`;

	// Validate file type
	const allowedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
	];
	if (!allowedTypes.includes(file.type)) {
		return NextResponse.json(
			{
				error:
					"Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.",
			},
			{ status: 400 },
		);
	}

	try {
		// Upload to Vercel Blob
		const blob = await put(filename, file, { access: "public" });
		return NextResponse.json({
			Message: "Image uploaded successfully",
			status: 201,
			fileUrl: blob.url,
		});
	} catch (error) {
		console.log("Error occurred ", error);
		return NextResponse.json({
			Message: "Failed to upload image",
			status: 500,
		});
	}
};
