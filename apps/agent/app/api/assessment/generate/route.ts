import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { type NextRequest, NextResponse } from "next/server";

interface AssessmentRequest {
	name: string;
	email: string;
	position: string;
	education?: string;
	experience?: string;
	portfolioUrl?: string;
	travelWillingness?: string;
	responses?: string[];
	advancedScreening?: Array<{
		question: string;
		answer: string;
		assessment: string;
		score: number;
	}>;
	resumeUrl?: string;
	aiScore?: number;
}

const chatModel = new ChatOpenAI({
	modelName: process.env.MODEL_NAME || "gpt-4",
	temperature: 0.1,
	openAIApiKey: process.env.OPENAI_API_KEY,
});

const assessmentPrompt = ChatPromptTemplate.fromTemplate(`
You are an expert HR consultant and recruiter. Generate a comprehensive candidate assessment based on the provided application data.

**CANDIDATE INFORMATION:**
- Name: {name}
- Email: {email}
- Position Applied For: {position}
- Education: {education}
- Experience: {experience}
- Portfolio: {portfolioUrl}
- Travel Willingness: {travelWillingness}

**INTERVIEW RESPONSES:**
{responses}

**ADVANCED SCREENING RESULTS:**
{advancedScreening}

**RESUME ANALYSIS:**
{resumeAnalysis}

**AI SCORE:** {aiScore}/100

---

**ASSESSMENT REQUIREMENTS:**
Generate a detailed professional assessment (500-800 words) using proper markdown formatting. Structure your response exactly as follows:

## Candidate Overview

Write 1-2 paragraphs providing a professional summary of the candidate, key background highlights, and overall fit for the role.

## Key Strengths

- **Technical Skills:** List and describe technical capabilities demonstrated
- **Communication:** Evaluate communication skills shown in responses
- **Problem-Solving:** Assess analytical and problem-solving abilities
- **Experience Relevance:** How their background aligns with the role
- **Unique Value:** What sets this candidate apart

## Areas for Consideration

- **Skill Gaps:** Any technical or experience gaps to note
- **Development Needs:** Skills that may need strengthening
- **Interview Focus:** Key areas to explore in further interviews
- **Potential Concerns:** Any red flags or areas requiring clarification

## Interview Performance

### Response Quality
Evaluate the depth, thoughtfulness, and relevance of their application responses.

### Advanced Screening Analysis
Analyze their performance on advanced screening questions, including specific examples from their answers.

### Communication Assessment
Comment on their written communication skills as demonstrated in their application.

## Hiring Recommendation

### Overall Assessment: **[Highly Recommend | Recommend | Consider | Not Recommended]**

### Score Justification
Explain the reasoning behind the {aiScore}/100 score, citing specific examples from their application.

### Next Steps
- Recommended interview focus areas
- Specific questions to ask
- Skills to evaluate further

### Onboarding Considerations
Expected integration timeline and support needs if hired.

## Additional Notes

- **Cultural Fit:** Indicators of how they might fit with company culture
- **Long-term Potential:** Growth trajectory and advancement possibilities
- **Special Considerations:** Any unique circumstances or standout qualities

---

**FORMATTING REQUIREMENTS:**
- Use proper markdown headers (##, ###)
- Use bullet points and numbered lists where appropriate
- Bold important terms and recommendations
- Keep paragraphs concise and scannable
- Use specific examples from their responses
- Maintain professional, objective tone throughout`);

export async function POST(request: NextRequest) {
	try {
		const data: AssessmentRequest = await request.json();

		const {
			name,
			email,
			position,
			education,
			experience,
			portfolioUrl,
			travelWillingness,
			responses,
			advancedScreening,
			resumeUrl,
			aiScore,
		} = data;

		// Validate required fields
		if (!name || !email || !position) {
			return NextResponse.json(
				{ error: "Missing required fields: name, email, position" },
				{ status: 400 },
			);
		}

		// Format responses for better readability
		const formattedResponses = responses
			? responses
					.map((response, index) => `${index + 1}. ${response}`)
					.join("\n")
			: "No responses provided";

		// Format advanced screening results
		const formattedAdvancedScreening = advancedScreening
			? advancedScreening
					.map(
						(screening) =>
							`Question: ${screening.question}\nAnswer: ${screening.answer}\nAssessment: ${screening.assessment}\nScore: ${screening.score}/10`,
					)
					.join("\n\n")
			: "No advanced screening completed";

		// Simple resume analysis (in production, you might want to extract text from PDF)
		const resumeAnalysis = resumeUrl
			? `Resume provided: ${resumeUrl}\n(Note: For enhanced assessment, integrate PDF text extraction and analysis)`
			: "No resume provided";

		// Generate the assessment
		const chain = assessmentPrompt
			.pipe(chatModel)
			.pipe(new StringOutputParser());

		const assessment = await chain.invoke({
			name,
			email,
			position,
			education: education || "Not provided",
			experience: experience || "Not provided",
			portfolioUrl: portfolioUrl || "Not provided",
			travelWillingness: travelWillingness || "Not specified",
			responses: formattedResponses,
			advancedScreening: formattedAdvancedScreening,
			resumeAnalysis,
			aiScore: aiScore || "Not calculated",
		});

		return NextResponse.json({
			success: true,
			assessment,
		});
	} catch (error) {
		console.error("Error generating assessment:", error);
		return NextResponse.json(
			{
				error: "Failed to generate assessment",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
