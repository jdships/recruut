import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { type NextRequest, NextResponse } from "next/server";

const chatModel = new ChatOpenAI({
	modelName: process.env.MODEL_NAME,
	temperature: 0.1,
	openAIApiKey: process.env.OPEN_AI_API_KEY,
});

interface ChatMessage {
	sender: string;
	text: string;
}

interface ExtractedData {
	name: string;
	email: string;
	phone: string;
	education: string;
	experience: string;
	portfolioUrl: string;
	travelWillingness: string;
	advancedScreening: {
		question: string;
		answer: string;
		assessment: string;
		score: number;
	}[];
}

const extractionPrompt = ChatPromptTemplate.fromMessages([
	[
		"system",
		`You are an AI assistant that extracts structured application data from chat conversations.

Extract the following information from the conversation:
- Name: Just the person's name (e.g., "John Smith" not "Hi my name is John Smith")
- Email: Email address if provided
- Phone: Phone number if provided
- Education: Educational background
- Experience: Work experience
- Portfolio URL: Website or portfolio link if provided
- Travel Willingness: Their response about travel willingness
- Advanced Screening: Extract any advanced screening questions and answers

For the advanced screening, look for patterns like:
"Advanced Screening Question: [question]"
"Candidate Answer: [answer]"
"Assessment: [assessment]"
"Score: [score]"

Return the data in this exact JSON format:
{{
  "name": "extracted name or empty string",
  "email": "extracted email or empty string", 
  "phone": "extracted phone or empty string",
  "education": "extracted education or empty string",
  "experience": "extracted experience or empty string",
  "portfolioUrl": "extracted URL or empty string",
  "travelWillingness": "extracted travel response or empty string",
  "advancedScreening": [
    {{
      "question": "the screening question",
      "answer": "the candidate's answer", 
      "assessment": "the AI's assessment",
      "score": number
    }}
  ]
}}

Only return valid JSON. If a field is not found, use an empty string or empty array.`,
	],
	["human", "Chat conversation:\n{chatHistory}"],
]);

const extractionChain = RunnableSequence.from([
	{
		chatHistory: (input: { chatHistory: ChatMessage[] }) =>
			input.chatHistory.map((msg) => `${msg.sender}: ${msg.text}`).join("\n"),
	},
	extractionPrompt,
	chatModel,
	new StringOutputParser(),
]);

export async function POST(req: NextRequest) {
	try {
		const { chatHistory } = await req.json();

		if (!chatHistory || !Array.isArray(chatHistory)) {
			return NextResponse.json(
				{ error: "Invalid chat history provided" },
				{ status: 400 },
			);
		}

		const result = await extractionChain.invoke({ chatHistory });

		// Parse the JSON response
		let extractedData: ExtractedData;
		try {
			extractedData = JSON.parse(result);
		} catch (_parseError) {
			console.error("Failed to parse AI extraction result:", result);
			return NextResponse.json(
				{ error: "Failed to parse extracted data" },
				{ status: 500 },
			);
		}

		return NextResponse.json(extractedData);
	} catch (error) {
		console.error("Error extracting application data:", error);
		return NextResponse.json(
			{ error: "Failed to extract application data" },
			{ status: 500 },
		);
	}
}
