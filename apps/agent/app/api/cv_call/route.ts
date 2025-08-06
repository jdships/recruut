import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { type NextRequest, NextResponse } from "next/server";

dotenv.config();

const chatModel = new ChatOpenAI({
	modelName: process.env.MODEL_NAME,
	temperature: 0.2,
	openAIApiKey: process.env.OPEN_AI_API_KEY,
});

const cv_question = ChatPromptTemplate.fromMessages([
	[
		"human",
		`Does the question asks user to load a cv? Output only YES or NO. The Question is:{question}`,
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

export async function POST(req: NextRequest) {
	const data = await req.json();
	const text = data.text as string;
	const load_cv = await cv_chain.invoke(text);
	console.log(text);
	return NextResponse.json({ text: load_cv });
}
