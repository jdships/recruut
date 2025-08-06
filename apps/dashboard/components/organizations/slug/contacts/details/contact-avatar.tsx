import { ContactRecord } from "@workspace/database/schema";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarProps,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import { BuildingIcon, UserIcon } from "lucide-react";
import type * as React from "react";

export type ContactAvatarProps = AvatarProps & {
	record: ContactRecord;
	src?: string;
	alt?: string;
	name?: string;
};

export function ContactAvatar({
	record,
	src,
	alt,
	name,
	className,
	...other
}: ContactAvatarProps): React.JSX.Element {
	const getInitials = (fullName?: string): string => {
		if (!fullName) return "";
		return fullName
			.split(" ")
			.map((part) => part.charAt(0).toUpperCase())
			.slice(0, 2)
			.join("");
	};

	return (
		<Avatar
			className={cn(
				"size-6 flex-none shrink-0",
				record === ContactRecord.PERSON && "rounded-full",
				record === ContactRecord.COMPANY && "rounded-sm",
				className,
			)}
			{...other}
		>
			<AvatarImage src={src} alt={alt ?? "avatar"} />
			<AvatarFallback className="text-xs font-medium">
				{name ? (
					getInitials(name)
				) : record === ContactRecord.COMPANY ? (
					<BuildingIcon className="size-3 shrink-0 text-muted-foreground" />
				) : (
					<UserIcon className="size-3 shrink-0 text-muted-foreground" />
				)}
			</AvatarFallback>
		</Avatar>
	);
}
