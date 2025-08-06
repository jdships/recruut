export type ApplicationCommentDto = {
	id: string;
	applicationId: string;
	text?: string;
	edited: boolean;
	createdAt: Date;
	updatedAt: Date;
	sender: {
		id: string;
		name: string;
		image?: string;
	};
};
