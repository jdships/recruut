import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { type NextRequest, NextResponse } from "next/server";

interface SummarizeExperienceRequest {
	rawExperience: string;
	position?: string;
}

const chatModel = new ChatOpenAI({
	modelName: process.env.MODEL_NAME || "gpt-4o-mini",
	temperature: 0.1,
	openAIApiKey: process.env.OPEN_AI_API_KEY,
});

const createExperienceSummaryPrompt = (
	rawExperience: string,
	position: string,
) => {
	return ChatPromptTemplate.fromMessages([
		[
			"system",
			`You are an expert recruiter who needs to create a concise, professional summary of a candidate's experience.

TASK: Extract and summarize the key information from the candidate's raw experience text into a concise summary that recruiters can quickly scan.

REQUIREMENTS:
- Keep the summary under 100 words maximum
- Focus on: years of experience, key technologies/skills, notable achievements, relevant projects
- Use bullet points for easy scanning
- Highlight quantifiable achievements (e.g., "increased performance by 40%")
- Include specific technologies and tools mentioned
- Maintain professional tone
- Remove unnecessary details, personal stories, or verbose explanations
- Structure as: Years of Experience → Key Skills → Notable Achievements → Relevant Projects
- DO NOT include quotes around the summary
- Return the summary as plain text without any formatting or quotes
- Be concise and impactful - every word counts

EXAMPLE OUTPUT FORMAT:
3+ years developing scalable web applications using TypeScript, React, and Node.js. Key skills: Full-stack development, API integration, performance optimization. Notable achievements: Led e-commerce platform serving 10K+ users, improved performance by 40%, mentored 3 junior developers. Recent projects: SaaS dashboard with real-time analytics, mobile-responsive applications.

POSITION: ${position}

RAW EXPERIENCE: ${rawExperience}

Generate a concise, recruiter-friendly summary without quotes:`,
		],
	]);
};

export async function POST(request: NextRequest) {
	try {
		const { rawExperience, position }: SummarizeExperienceRequest =
			await request.json();

		if (!rawExperience) {
			return NextResponse.json(
				{ error: "Raw experience text is required" },
				{ status: 400 },
			);
		}

		const prompt = createExperienceSummaryPrompt(
			rawExperience,
			position || "Software Engineer",
		);

		const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

		const summary = (await chain.invoke({
			rawExperience,
			position: position || "Software Engineer",
		})) as string;

		return NextResponse.json({
			success: true,
			summary: summary.trim(),
		});
	} catch (error) {
		console.error("Error generating experience summary:", error);
		return NextResponse.json(
			{ error: "Failed to generate experience summary" },
			{ status: 500 },
		);
	}
}
