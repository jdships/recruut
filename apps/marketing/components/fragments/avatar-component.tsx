import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import {
	type AvatarData,
	AvatarGroup,
} from "@workspace/ui/components/avatar-group";
import { Label } from "@workspace/ui/components/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import * as React from "react";

const demoAvatars: AvatarData[] = [
	{
		id: "1",
		name: "Beatrice Richter",
		image: "/assets/people/beatrice_richter.png",
	},
	{
		id: "2",
		name: "Gabriel Fischer",
		image: "/assets/people/gabriel_fischer.png",
	},
	{
		id: "3",
		name: "Hugo Schmidt",
		image: "/assets/people/hugo_schmidt.png",
	},
	{
		id: "4",
		name: "Ishaan Richardson",
		image: "/assets/people/ishaan_richardson.png",
	},
	{
		id: "5",
		name: "Kathleen Graves",
		image: "/assets/people/kathleen_graves.png",
	},
	{
		id: "6",
		name: "Lucia Bianchi",
		image: "/assets/people/lucia_bianchi.png",
	},
	{
		id: "7",
		name: "Marie Jones",
		image: "/assets/people/marie_jones.png",
	},
];

export const AvatarGroupDemo = () => {
	const renderAvatarWithTooltip = (avatar: AvatarData) => {
		return (
			<Tooltip key={avatar.id}>
				<TooltipTrigger asChild>
					<Avatar
						title={avatar.name}
						className="ring-2 ring-background transition-all duration-200 ease-in-out hover:z-10 hover:-translate-x-1 cursor-pointer"
					>
						{avatar.image && (
							<AvatarImage src={avatar.image} alt={avatar.name} />
						)}
						<AvatarFallback>
							{avatar.name
								.split(" ")
								.map((word) => word[0])
								.join("")
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</TooltipTrigger>
				<TooltipContent>
					<p>{avatar.name}</p>
				</TooltipContent>
			</Tooltip>
		);
	};

	return (
		<div className="space-y-8 p-4">
			<div className="space-y-4">
				<Label>Exceptional Applicants</Label>
				<AvatarGroup
					avatars={demoAvatars}
					renderAvatar={renderAvatarWithTooltip}
				/>
			</div>
		</div>
	);
};

export default AvatarGroupDemo;
