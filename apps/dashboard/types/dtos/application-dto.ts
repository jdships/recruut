export type ApplicationDto = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	education?: string;
	experience?: string;
	portfolioUrl?: string;
	travelWillingness?: string;
	resumeUrl?: string;
	image?: string;
	aiScore?: number;
	aiFlag?: string;
	aiAssessment?: string; // Comprehensive AI-generated assessment for recruiters
	manualFlag?: string;
	status?: string;
	submissionData?: Record<string, unknown>;
	createdAt: Date;
	opportunityId: string;
	opportunityTitle?: string;
};
