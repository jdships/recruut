"use client";

import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { Upload, X } from "lucide-react";
import * as React from "react";

export function VercelBlobUpload({
	onValueChange,
}: {
	onValueChange: (urls: string[]) => void;
}) {
	const [files, setFiles] = React.useState<File[]>([]);
	const [_uploading, _setUploading] = React.useState(false);
	const [uploadedUrls, setUploadedUrls] = React.useState<string[]>([]);
	const [error, setError] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const selected = Array.from(e.target.files);
		const allowedTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"text/plain",
			"text/csv",
			"image/png",
			"image/jpeg",
			"image/jpg",
		];
		const MAX_SIZE = 10 * 1024 * 1024;
		const valid: File[] = [];
		for (const file of selected) {
			if (!allowedTypes.includes(file.type)) {
				setError("Only PDF, DOC, DOCX, TXT, CSV, PNG, JPG files are allowed");
				return;
			}
			if (file.size > MAX_SIZE) {
				setError(`File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`);
				return;
			}
			valid.push(file);
		}
		if (valid.length + files.length > 2) {
			setError("You can only upload up to 2 files");
			return;
		}
		setError(null);
		setFiles((prev) => [...prev, ...valid]);

		// Auto-upload logic
		_setUploading(true);
		const urls: string[] = [];
		for (const file of valid) {
			try {
				const formData = new FormData();
				formData.append("file", file);
				const res = await fetch("/api/upload-document", {
					method: "POST",
					body: formData,
				});
				const data = await res.json();
				if (!res.ok) {
					setError(data.error || `Failed to upload file: ${file.name}`);
				} else {
					urls.push(data.url);
				}
			} catch (_e) {
				setError("Failed to upload file: " + file.name);
			}
		}
		_setUploading(false);
		setUploadedUrls((prev) => [...prev, ...urls]);
		onValueChange([...uploadedUrls, ...urls]);
		if (urls.length > 0) {
			toast.success("Upload successful", {
				description:
					urls.length === 1
						? "Your document has been uploaded."
						: `Your ${urls.length} documents have been uploaded.`,
			});
		}
	};

	const handleRemove = (idx: number) => {
		setFiles((prev) => {
			const newFiles = prev.filter((_, i) => i !== idx);
			const newUrls = uploadedUrls.filter((_, i) => i !== idx);
			setUploadedUrls(newUrls);
			onValueChange(newUrls);
			return newFiles;
		});
	};

	return (
		<div className="w-full">
			<button
				type="button"
				className="border border-dashed rounded-xl p-4 flex flex-col items-center justify-center min-h-40 bg-muted/50 hover:bg-muted/80 w-full transition-colors"
				onClick={() => fileInputRef.current?.click()}
				aria-label="Upload files"
			>
				<Upload className="size-5 text-muted-foreground mb-2" />
				<p className="font-medium text-sm">
					Drag & drop or click to browse (max 2 files)
				</p>
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf,.doc,.docx,.txt,.csv,image/png,image/jpeg,image/jpg"
					multiple
					className="hidden"
					onChange={onFileChange}
				/>
			</button>
			<ul className="mt-2 space-y-2">
				{files.map((file, idx) => (
					<li
						key={file.name}
						className="flex items-center justify-between bg-accent rounded px-2 py-1 text-xs"
					>
						<span className="truncate max-w-[180px]">{file.name}</span>
						<Button
							variant="ghost"
							size="icon"
							className="size-6"
							onClick={() => handleRemove(idx)}
						>
							<X className="size-4" />
						</Button>
					</li>
				))}
			</ul>
			{error && <p className="text-xs text-red-600 mt-2">{error}</p>}
		</div>
	);
}
