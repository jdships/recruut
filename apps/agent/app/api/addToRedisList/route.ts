import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { Index } from "@upstash/vector";
import { StreamingTextResponse } from "ai";
import dotenv from "dotenv";
import { BufferMemory } from "langchain/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { type NextRequest, NextResponse } from "next/server";

dotenv.config();
export const maxDuration = 60;

// Types
interface OpportunityData {
	"welcome-message": string;
	"goodbye-message": string;
	questions: string[];
	position: string;
	description: string;
	"position-link": string;
	documents: string[];
	"more-context": string;
	"hiring-manager-email": string;
	organizationId: string;
	opportunityId: string;
}

interface RequestData {
	text: string;
	channel_name: string;
	type?: number;
	opportunityId: string;
	ai_output?: string;
}

// Initialize services
const index = new Index({
	url: process.env.UPSTASH_VECTOR_REST_URL ?? "",
	token: process.env.UPSTASH_VECTOR_REST_TOKEN ?? "",
});

const chatModel = new ChatOpenAI({
	modelName: process.env.MODEL_NAME,
	temperature: 0.1,
	openAIApiKey: process.env.OPEN_AI_API_KEY,
	streaming: true,
});

// Simple in-memory cache for opportunity data
const opportunityCache = new Map<
	string,
	{ data: OpportunityData; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Clean up expired cache entries
const cleanupCache = () => {
	const now = Date.now();
	for (const [key, value] of opportunityCache.entries()) {
		if (now - value.timestamp > CACHE_TTL) {
			opportunityCache.delete(key);
		}
	}
};

// Dynamic opportunity data loading with caching
const loadOpportunityData = async (
	opportunityId: string,
): Promise<OpportunityData> => {
	// Clean up expired cache entries
	cleanupCache();

	// Check cache first
	const cached = opportunityCache.get(opportunityId);
	const now = Date.now();

	if (cached && now - cached.timestamp < CACHE_TTL) {
		console.log(`Using cached opportunity data for ID: ${opportunityId}`);
		return cached.data;
	}

	try {
		const apiUrl = `${process.env.NEXT_PUBLIC_AGENT_URL}/api/opportunity/${opportunityId}`;
		console.log(`Fetching opportunity from: ${apiUrl}`);

		const response = await fetch(apiUrl);

		console.log(`Response status: ${response.status} ${response.statusText}`);

		if (!response.ok) {
			const errorBody = await response.text();
			console.error(`Failed to fetch opportunity data:`, {
				status: response.status,
				statusText: response.statusText,
				body: errorBody,
			});
			throw new Error(
				`HTTP ${response.status}: ${response.statusText} - ${errorBody}`,
			);
		}

		const opportunityData = await response.json();
		console.log("Raw opportunity data:", opportunityData);

		// Validate that we have the required data
		if (!opportunityData || !opportunityData.title) {
			console.error("Invalid opportunity data received:", opportunityData);
			throw new Error("Invalid opportunity data: missing title");
		}

		const processedData: OpportunityData = {
			"welcome-message": `Hello! I am an AI powered recruiting assistant for Recruut. I will help with your application process.`,
			"goodbye-message":
				"Thank you for applying. We will review your application and inform you about the following steps. Good luck!",
			questions: opportunityData.questions || [],
			position: opportunityData.title,
			description: opportunityData.description || "",
			"position-link": opportunityData.positionLink || "",
			documents: opportunityData.documents || [],
			"more-context": opportunityData.moreContext || "",
			"hiring-manager-email": opportunityData.hiringManagerEmail || "",
			organizationId: opportunityData.organizationId || "",
			opportunityId: opportunityData.id || opportunityId,
		};

		// Check if opportunity is paused
		if (opportunityData.status === "paused") {
			throw new Error(
				"This opportunity is currently paused and not accepting new applications",
			);
		}

		console.log("Processed opportunity data:", {
			position: processedData.position,
			questionsCount: processedData.questions.length,
			organizationId: processedData.organizationId,
			status: opportunityData.status,
		});

		// Cache the processed data
		opportunityCache.set(opportunityId, {
			data: processedData,
			timestamp: now,
		});
		console.log(`Cached opportunity data for ID: ${opportunityId}`);

		return processedData;
	} catch (e) {
		console.error("Error in loadOpportunityData:", e);
		throw e; // Re-throw to let caller handle it
	}
};

async function getRelevantDocuments(
	question: string,
	opportunityId: string,
): Promise<string> {
	// Use Upstash built-in embedding: query with data, not vector
	const results = await index.query({
		data: question, // Let Upstash embed it
		includeVectors: false,
		includeMetadata: true,
		topK: 5,
	});

	let contentString = "";
	for (let i = 0; i < results.length; i++) {
		const metadata = results[i]?.metadata;
		const content = metadata?.content;
		const resultOpportunityId = metadata?.opportunityId;

		// Only include content from the current opportunity
		if (
			content &&
			typeof content === "string" &&
			resultOpportunityId === opportunityId
		) {
			contentString += content + "\n";
		}
	}
	return contentString;
}

const getretriever = async (
	documents: string[],
	morecontext?: string,
	opportunityId?: string,
): Promise<void> => {
	const loaded_documents: Document[] = [];
	for (const doc of documents) {
		const loader = new CheerioWebBaseLoader(doc);
		const docs = await loader.load();
		const splitter = new RecursiveCharacterTextSplitter();
		const splitDocs = await splitter.splitDocuments(docs);
		loaded_documents.push(...splitDocs);
	}
	if (morecontext) {
		loaded_documents.push(new Document({ pageContent: morecontext }));
	}

	// Upstash built-in embedding: upsert with data, not vector
	const vectors = [];
	for (let i = 0; i < loaded_documents.length; i++) {
		vectors.push({
			id: Math.random(),
			data: loaded_documents[i].pageContent,
			metadata: {
				content: loaded_documents[i].pageContent,
				opportunityId: opportunityId || "unknown",
				type: "document",
			},
		});
	}
	await index.upsert(vectors);
};

// Create the prompt with proper template construction
const createPrompt = (
	welcomeMsg: string,
	questionsArray: string[],
	jobTitle?: string,
	jobDescription?: string,
	jobContext?: string,
) => {
	const jobInfo =
		jobTitle || jobDescription || jobContext
			? `\n\nJOB INFORMATION:
${jobTitle ? `Position: ${jobTitle}` : ""}
${jobDescription ? `Description: ${jobDescription}` : ""}
${jobContext ? `Additional Context: ${jobContext}` : ""}`
			: "";

	return ChatPromptTemplate.fromMessages([
		[
			"system",
			`You are a helpful AI recruiting assistant for a job application process.${jobInfo}

CONVERSATION FLOW:
1. When greeting the user for the first time (when chat history is empty), respond with exactly: "${welcomeMsg} Before we get started, may I know your name, please?"
2. After getting the name, ask for their email address
3. After getting the email, ask the questions from the provided list one by one and wait for the user to answer between the questions
4. Use chat previous chat history to determine which question to ask
5. If the previous answer does not answer the previous question properly, ask the previous question again
6. After ALL questions are answered (including the advanced screening question), ask user to upload their CV/resume in PDF format
7. After the user uploads their CV/resume, acknowledge it and then ask for profile picture upload

QUESTIONS TO ASK IN EXACT ORDER:
1. "What is your phone number?"
2. "Tell me about your relevant experience for this position."
3. "What is your educational background?"
4. "Do you have a portfolio or website you'd like to share?"
5. "Are you willing to travel if required for this role?"
6. "Can you describe a challenging technical problem you solved recently and how you approached it?"

CRITICAL RULES:
- You MUST ask ALL questions from the list in order, one by one
- Do NOT skip any questions
- Do NOT ask for CV upload until ALL 6 questions are answered
- Count the user's answers carefully to determine which question to ask next
- After the user answers question 5 (travel), you MUST ask question 6 (advanced screening)
- Only after question 6 is answered, ask for CV upload

ADVANCED SCREENING QUESTION HANDLING:
When asking the advanced screening question (the last question in the list), simply ask the question naturally like any other question.

After the user answers the advanced screening question, respond with:

**USER RESPONSE (what they see):**
[Natural conversational response like "Thank you for that insight!" or "Great answer!"]

Now that we've covered the key questions, could you please upload your CV/resume? This will help us better understand your background and experience.

**ASSESSMENT DATA (for backend processing only):**
Advanced Screening Question: [the question you asked]
Candidate Answer: [their exact response]
Assessment: [your detailed evaluation of their answer in 1-2 sentences]
Score: [1-10 rating based on their answer quality]

Remember: Only show the user the conversational response, not the assessment data.

IMPORTANT: Do NOT ask for profile picture upload in the same message as CV upload. Only ask for CV upload first, then wait for the user to upload their CV before asking for profile picture.

CONTEXT: {context}

HISTORY: {history}

USER INPUT: {input}

FORMATTING RULES:
- Always use proper line breaks and paragraph spacing for readability
- When providing job details or long information, format it with clear sections and line breaks
- Use bullet points or numbered lists when appropriate
- Separate different topics or sections with blank lines
- Make responses easy to read and visually appealing
- Use markdown formatting for better presentation:
  * Use **bold** for emphasis and section headers
  * Use bullet points (• or -) for lists
  * Use line breaks (double space + enter) for paragraph separation
  * Use proper spacing between sections

JOB DETAILS FORMATTING:
When providing job information, ALWAYS format it EXACTLY like this example:

**Job Title:** Frontend Developer

**Company:** Total Vehicle Quality & CoP Feature Team

**Location:** Remote

**Type:** Full-time

**Published:** January 2024

**Company Overview:**

Join the Total Vehicle Quality & CoP Feature Team as a Front End Developer, where you'll collaborate across international teams, drive innovation in UI development, and contribute to a powerful suite of engineering and quality assurance tools.

**Role & Responsibilities:**

• Collaborate with international teams

• Drive innovation in UI development

• Contribute to engineering and quality assurance tools

• Build scalable and maintainable code

• Work with modern frontend technologies

**Requirements:**

• Expertise in Angular

• Experience in Agile environment

• Value clean code, performance, and user experience

• Strong communication skills

RESPONSE FORMATTING:
When responding to user questions about job details:
1. Start with a brief acknowledgment
2. Use the job details formatting above with EXACT spacing and line breaks
3. Add proper line breaks between sections
4. Use bullet points for lists
5. End with an invitation to continue the conversation

CRITICAL: Always use double line breaks between sections and single line breaks within sections. Use proper markdown syntax that will render correctly with React Markdown.`,
		],
		new MessagesPlaceholder("history"),
		["user", "{input}"],
	]);
};

// Define chain components
const cv_question = ChatPromptTemplate.fromMessages([
	[
		"human",
		`Does the question ask the user to upload or provide their CV/resume? Output only YES or NO. The Question is:{question}`,
	],
]);

const cv_chain = RunnableSequence.from([
	{
		question: (i: string) => i,
	},
	cv_question,
	chatModel,
	new StringOutputParser(),
]);

// Define missing prompts
const extractor_prompt = ChatPromptTemplate.fromMessages([
	new MessagesPlaceholder("history"),
	[
		"human",
		`Extract answers of the questions from the chat history. Output must include the user's name, email and answers to the questions paired with their corresponding questions. Each element of the output must be separated by semicolon. Questions:{input}`,
	],
]);

const email_prompt = ChatPromptTemplate.fromMessages([
	["system", `You are going to send an email to the hiring manager.`],
	new MessagesPlaceholder("history"),
	[
		"human",
		`List questions asked by the user after the user uploaded the CV. Use chat history to determine the questions asked by the user and the answers. Each question and answer in the output must be enumareted and separated by a newline.`,
	],
]);

const end_prompt = ChatPromptTemplate.fromMessages([
	[
		"system",
		`Say goodbye to the user using the following message: {endmessage}`,
	],
	new MessagesPlaceholder("history"),
	["human", `{input}`],
]);

const email_question = ChatPromptTemplate.fromMessages([
	["system", ``],
	new MessagesPlaceholder("history"),
	[
		"human",
		`What is my email address? Just output the email address nothing else. `,
	],
]);

const email_extractor_chain = RunnableSequence.from([
	{
		memory: (i: { mem: BufferMemory }) => i.mem.loadMemoryVariables({}),
	},
	{
		history: (previousOutput: { memory: { history: string } }) =>
			previousOutput.memory.history,
	},
	email_question,
	chatModel,
	new StringOutputParser(),
]);

const answer_chain = RunnableSequence.from([
	{
		input: (i: { input: string[]; mem: BufferMemory }) => i.input,
		memory: (i: { input: string[]; mem: BufferMemory }) =>
			i.mem.loadMemoryVariables({}),
	},
	{
		input: (previousOutput: { input: string[] }) => previousOutput.input,
		history: (previousOutput: { memory: { history: string } }) =>
			previousOutput.memory.history,
	},
	extractor_prompt,
	chatModel,
	new StringOutputParser(),
]);

const email_chain = RunnableSequence.from([
	{
		memory: (i: { mem: BufferMemory }) => i.mem.loadMemoryVariables({}),
	},
	{
		history: (previousOutput: { memory: { history: string } }) =>
			previousOutput.memory.history,
	},
	email_prompt,
	chatModel,
	new StringOutputParser(),
]);

export async function POST(req: NextRequest) {
	const data: RequestData = await req.json();
	const text = data.text; // unanswered questions for type 6
	const channel = data.channel_name;
	const type = data.type ?? -1;
	const opportunityId = data.opportunityId;

	console.log(`${type}:${channel} opportunityId:${opportunityId}`);

	// Load opportunity data - REQUIRED for chat to work
	if (!opportunityId) {
		console.error("No opportunity ID provided");
		return NextResponse.json(
			{
				error:
					"No opportunity ID provided. Please access this chat through a valid opportunity link.",
			},
			{ status: 400 },
		);
	}

	let jsonData: OpportunityData;
	let endmessage: string;
	let questions: string[];
	let documents: string[];
	let morecontext: string;
	let welcomemessage: string;
	let prompt1: ChatPromptTemplate;

	try {
		console.log(`Loading opportunity data for ID: ${opportunityId}`);
		const opportunityData = await loadOpportunityData(opportunityId);

		if (!opportunityData) {
			console.error(`Opportunity not found for ID: ${opportunityId}`);
			return NextResponse.json(
				{
					error: "Opportunity not found. Please check your link and try again.",
				},
				{ status: 404 },
			);
		}

		console.log("Opportunity data loaded successfully:", {
			title: opportunityData.position,
			questionsCount: opportunityData.questions?.length || 0,
			organizationId: opportunityData.organizationId,
		});

		jsonData = opportunityData;
		endmessage = jsonData["goodbye-message"];
		questions = jsonData.questions;
		documents = jsonData.documents || [];
		morecontext = jsonData["more-context"];
		welcomemessage = jsonData["welcome-message"];

		// Create the prompt with the loaded data and job information
		prompt1 = createPrompt(
			welcomemessage,
			questions,
			jsonData.position,
			jsonData.description,
			jsonData["more-context"],
		);
	} catch (error) {
		console.error("Failed to load opportunity data:", error);

		// Check if this is a paused opportunity error
		if (error instanceof Error && error.message.includes("paused")) {
			return NextResponse.json(
				{
					error:
						"This opportunity is currently paused and not accepting new applications",
				},
				{ status: 403 },
			);
		}

		return NextResponse.json(
			{
				error:
					"Unable to load opportunity data. Please try again later or contact support.",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}

	// Create the end_chain with the loaded endmessage
	const end_chain = RunnableSequence.from([
		{
			input: (i: { input: string; mem: BufferMemory }) => i.input,
			memory: (i: { input: string; mem: BufferMemory }) =>
				i.mem.loadMemoryVariables({}),
		},
		{
			history: (previousOutput: { memory: { history: string } }) =>
				previousOutput.memory.history,
			input: (previousOutput: { input: string }) => previousOutput.input,
			endmessage: () => endmessage,
		},
		end_prompt,
		chatModel,
		new StringOutputParser(),
	]);

	// Create the chat chain with the dynamic prompt
	const chat_chain = RunnableSequence.from([
		{
			input: (i: { input: string; mem: BufferMemory; context: string }) =>
				i.input,
			memory: (i: { input: string; mem: BufferMemory; context: string }) =>
				i.mem.loadMemoryVariables({}),
			context: (i: { input: string; mem: BufferMemory; context: string }) =>
				i.context,
		},
		{
			input: (previousOutput: { input: string }) => previousOutput.input,
			history: (previousOutput: { memory: { history: string } }) =>
				previousOutput.memory.history,
			context: (previousOutput: { context: string }) => previousOutput.context,
		},
		prompt1,
		chatModel,
		new StringOutputParser(),
	]);

	const memory = new BufferMemory({
		returnMessages: true,
		chatHistory: new UpstashRedisChatMessageHistory({
			sessionId: channel,
			config: {
				url: process.env.UPSTASH_REDIS_REST_URL ?? "",
				token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
			},
		}),
	});

	const ai_output = data.ai_output; // answers questions for type 6

	if (type === 0) {
		const load_cv = await cv_chain.invoke(text);
		const normalized = String(load_cv).trim().toLowerCase();
		if (normalized.startsWith("yes")) {
			return NextResponse.json("yes");
		} else {
			return NextResponse.json("no");
		}
	} else if (type === 1) {
		let context = await getRelevantDocuments(text, opportunityId);
		if (context === "") {
			await getretriever(documents, morecontext, opportunityId);
			context = await getRelevantDocuments(text, opportunityId);
		}
		const stream = await chat_chain.stream({
			input: text,
			context: context,
			mem: memory,
		});
		return new StreamingTextResponse(stream);
	} else if (type === 2) {
		await memory.saveContext(
			{
				input: text,
			},
			{
				output: ai_output,
			},
		);
		return NextResponse.json({ Message: "Chat history saved.", status: 201 });
	} else if (type === 3) {
		// isfinished
		const is_finished = await end_chain.stream({ input: "", mem: memory });
		return new StreamingTextResponse(is_finished);
	} else if (type === 4) {
		const email_text = await email_chain.stream({ mem: memory });
		return new StreamingTextResponse(email_text);
	} else if (type === 5) {
		const answers = await answer_chain.stream({
			input: questions,
			mem: memory,
		});
		return new StreamingTextResponse(answers);
	} else if (type === 7) {
		const email = await email_extractor_chain.stream({ mem: memory });
		return new StreamingTextResponse(email);
	} else {
		return NextResponse.json({ error: "Invalid type." }, { status: 405 });
	}
}
