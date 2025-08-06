export type OpportunityQuestionDto = {
	question: string;
};

export type OpportunityDto = {
	title: string;
	description?: string;
	questions: OpportunityQuestionDto[];
};

export type TopOpportunityDto = {
	id: string;
	title: string;
	description?: string;
	submissionCount: number;
};

export type TopCandidateDto = {
	id: string;
	name: string;
	email: string;
	aiScore: number | null;
	image?: string;
};
