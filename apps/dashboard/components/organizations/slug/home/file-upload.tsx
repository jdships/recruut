"use client";

import FileUpload from "@workspace/ui/components/file-upload";
import * as React from "react";

export function FileUploadVercelBlob({
	onValueChange: _onValueChange,
}: {
	onValueChange: (urls: string[]) => void;
}) {
	const [uploadedUrls] = React.useState<string[]>([]);
	const [error] = React.useState<string | null>(null);

	// You may want to handle uploads after FileUpload triggers a change,
	// but since FileUpload does not accept props, you need to handle uploads separately.
	// For now, just render the FileUpload component.

	return (
		<div>
			<FileUpload />
			{error && <p className="text-xs text-red-600 mt-2">{error}</p>}
			{uploadedUrls.length > 0 && (
				<div className="mt-2 text-xs text-green-600">
					Uploaded:
					<ul>
						{uploadedUrls.map((url) => (
							<li key={url}>
								<a href={url} target="_blank" rel="noopener noreferrer">
									{url}
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
