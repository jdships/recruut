"use client";

// Import kibo-ui AIInput components
import {
	AIInput,
	AIInputButton,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from "@workspace/ui/components/ai-input";
// Import the new AIMessage components
import {
	AIMessage,
	AIMessageContent,
} from "@workspace/ui/components/ai-message";
import { Logo } from "@workspace/ui/components/logo";
import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { clsx } from "clsx";
import { Check, FileText, HelpCircle, Image, Info, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import PoweredBy from "../powered-by";
import { AiLogo } from "./ai-logo";

// Helper function to extract application data from chat history using AI
async function extractApplicationDataFromChat(
	chatHistory: { sender: string; text: string }[],
	_questions: string[],
) {
	try {
		const response = await fetch("/api/extract-application-data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ chatHistory }),
		});

		if (!response.ok) {
			console.error("Failed to extract application data");
			throw new Error("Failed to extract application data");
		}

		const extractedData = await response.json();

		return {
			name: extractedData.name || "",
			email: extractedData.email || "",
			phone: extractedData.phone || "",
			education: extractedData.education || "",
			experience: extractedData.experience || "",
			portfolioUrl: extractedData.portfolioUrl || "",
			travelWillingness: extractedData.travelWillingness || "",
			answers: chatHistory
				.filter((msg) => msg.sender === "user")
				.map((msg) => msg.text),
			advancedScreening: extractedData.advancedScreening || [],
		};
	} catch (error) {
		console.error("Error extracting application data:", error);
		// Fallback to empty data if AI extraction fails
		return {
			name: "",
			email: "",
			phone: "",
			education: "",
			experience: "",
			portfolioUrl: "",
			travelWillingness: "",
			answers: chatHistory
				.filter((msg) => msg.sender === "user")
				.map((msg) => msg.text),
			advancedScreening: [],
		};
	}
}

interface Opportunity {
	id: string;
	title: string;
	description: string;
	questions: string[];
	organizationId: string;
}

interface AgentChatProps {
	opportunity: Opportunity;
}

// Define a type for chat messages
interface ChatMessage {
	text: string;
	sender: string;
}

export default function AgentChat({ opportunity }: AgentChatProps) {
	// Use a ref for unique_id to avoid unnecessary re-renders and dependency warnings
	const uniqueIdRef = useRef<string>("");
	const [inputText, setInputText] = useState("");
	const [listData, setListData] = useState<ChatMessage[]>([]);
	const [cv_upload, setCvUpload] = useState(false);
	const [loading, setLoading] = useState(false);
	const [canfinish, setCanfinish] = useState(false);
	const [askfinish, setAskfinish] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
	const [resumeUrl, setResumeUrl] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>("");
	const [showImageUpload, setShowImageUpload] = useState(false);
	const [applicationCompleted, setApplicationCompleted] = useState(false); // New state to track completion
	const [_applicationData, _setApplicationData] = useState({
		name: "",
		email: "",
		phone: "",
		education: "",
		experience: "",
		portfolioUrl: "",
		travelWillingness: "",
		answers: [],
	});
	const [isOpportunityPaused, setIsOpportunityPaused] = useState(false);

	const handleFileInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSelectedFile(event.target.files ? event.target.files[0] : null);
	};

	const handleImageInputChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSelectedImageFile(event.target.files ? event.target.files[0] : null);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (!uniqueIdRef.current) {
				try {
					setLoading(true);
					const id = uuidv4();
					uniqueIdRef.current = id;

					// Pass opportunity data to the API
					const response = await fetch("/api/addToRedisList", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							channel_name: uniqueIdRef.current,
							text: "hello",
							type: 1,
							ai_output: "",
							opportunityId: opportunity.id,
						}),
					});

					if (response.ok) {
						// Create a streaming response handler for initial greeting
						const reader = response.body?.getReader();
						const decoder = new TextDecoder("utf-8");
						let accumulatedText = "";

						// Add a placeholder AI message that will be updated
						setListData((prev) => [...prev, { text: "", sender: "ai" }]);

						// Add a small delay to make the "Thinking..." state visible
						await new Promise((resolve) => setTimeout(resolve, 500));

						if (reader) {
							try {
								while (true) {
									const { done, value } = await reader.read();

									if (done) break;

									const chunk = decoder.decode(value, { stream: true });
									accumulatedText += chunk;

									// Update the last AI message with accumulated text
									setListData((prev) => {
										const newList = [...prev];
										const lastMessage = newList[newList.length - 1];
										if (lastMessage && lastMessage.sender === "ai") {
											lastMessage.text = accumulatedText;
										}
										return newList;
									});
								}
							} finally {
								reader.releaseLock();
							}
						}

						setLoading(false);
						setInputText("");

						const response2 = await fetch("/api/addToRedisList", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								channel_name: uniqueIdRef.current,
								text: "hello", // This is correct for initial greeting
								type: 2,
								ai_output: accumulatedText,
								opportunityId: opportunity.id,
							}),
						});

						if (response2.ok) {
							// ok
						} else {
							console.error("Failed to save chat history.");
						}
					} else if (response.status === 403) {
						// Handle paused opportunity
						const errorData = await response.json();
						setListData([
							{
								text:
									errorData.error ||
									"This opportunity is currently paused and not accepting new applications.",
								sender: "ai",
							},
						]);
						setLoading(false);
						setIsOpportunityPaused(true);
					} else {
						console.error("Failed to receive answer from backend1.");
						setListData([
							{
								text: "Sorry, there was an error loading this opportunity. Please try again later.",
								sender: "ai",
							},
						]);
						setLoading(false);
					}
				} catch (error) {
					console.error("Error submitting form:", error);
				}
			}
		};

		fetchData();
	}, [opportunity]);

	function cx(...inputs: unknown[]) {
		return twMerge(clsx(inputs));
	}

	const handletextSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Prevent submission if application is completed
		if (applicationCompleted) {
			return;
		}

		const user_input = { text: inputText, sender: "user" };
		const temp_text = inputText;
		setInputText("");
		setLoading(true);

		// Add user message and empty AI message for streaming
		setListData((prev) => [...prev, user_input, { text: "", sender: "ai" }]);

		// Add a small delay to make the "Thinking..." state visible
		await new Promise((resolve) => setTimeout(resolve, 500));

		try {
			const response = await fetch("/api/addToRedisList", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					channel_name: uniqueIdRef.current,
					text: temp_text,
					type: 1,
					ai_output: "",
					opportunityId: opportunity.id,
				}),
			});

			if (response.ok) {
				// Create a streaming response handler
				const reader = response.body?.getReader();
				const decoder = new TextDecoder("utf-8");
				let accumulatedText = "";

				if (reader) {
					try {
						while (true) {
							const { done, value } = await reader.read();

							if (done) break;

							const chunk = decoder.decode(value, { stream: true });
							accumulatedText += chunk;

							// Update the last AI message with accumulated text
							setListData((prev) => {
								const newList = [...prev];
								const lastMessage = newList[newList.length - 1];
								if (lastMessage && lastMessage.sender === "ai") {
									lastMessage.text = accumulatedText;
								}
								return newList;
							});
						}
					} finally {
						reader.releaseLock();
					}
				}

				// Debug: Log the full accumulatedText after streaming
				console.log(
					"[DEBUG] Full AI response (accumulatedText):",
					accumulatedText,
				);

				setLoading(false);

				// Save the complete response to chat history
				const response2 = await fetch("/api/addToRedisList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						channel_name: uniqueIdRef.current,
						text: temp_text,
						type: 2,
						ai_output: accumulatedText,
						opportunityId: opportunity.id,
					}),
				});

				if (response2.ok) {
					// Check if AI response asks for CV upload using type 0
					const cvCheckResponse = await fetch("/api/addToRedisList", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							channel_name: uniqueIdRef.current,
							text: accumulatedText,
							type: 0,
							ai_output: "",
							opportunityId: opportunity.id,
						}),
					});

					if (cvCheckResponse.ok) {
						const cvCheckResult = await cvCheckResponse.text();
						// Debug: Log the result of the type 0 check
						console.log(
							"[DEBUG] Type 0 check result (cvCheckResult):",
							cvCheckResult,
						);
						if (cvCheckResult.toLowerCase().replace(/"/g, "") === "yes") {
							console.log("[DEBUG] Setting cv_upload to true");
							setCvUpload(true);
							console.log("[DEBUG] cv_upload set to true");
							// Force a re-render to ensure the state update is reflected
							setTimeout(() => {
								console.log(
									"[DEBUG] cv_upload state after timeout:",
									cv_upload,
								);
							}, 100);
							// Don't call checkConversationState when CV upload is detected
							return;
						} else {
							// Check conversation state to determine next step
							setListData((currentList) => {
								checkConversationState(currentList);
								return currentList;
							});
						}
					} else {
						console.error("Failed to check CV upload status.");
					}
				} else {
					console.error("Failed to save chat history.");
				}
			} else {
				console.error("Failed to receive answer from backend2.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	// Helper function to determine conversation state
	const checkConversationState = (currentListData: ChatMessage[]) => {
		// If application is already completed, don't change any state
		if (applicationCompleted) {
			return;
		}

		const userMessages = currentListData.filter((msg) => msg.sender === "user");
		const aiMessages = currentListData.filter((msg) => msg.sender === "ai");

		// Check the last AI and user messages
		const lastAiMessage =
			aiMessages[aiMessages.length - 1]?.text?.toLowerCase() || "";
		const lastUserMessage =
			userMessages[userMessages.length - 1]?.text?.toLowerCase() || "";

		// Profile picture flow handling
		if (
			lastAiMessage.includes("profile picture") &&
			(lastAiMessage.includes("type 'yes' or 'skip'") ||
				lastAiMessage.includes("you can type 'yes' or 'skip'"))
		) {
			// AI is asking about profile picture - wait for user response
			return;
		}

		// If user typed "yes" after profile picture question
		if (
			lastUserMessage === "yes" &&
			aiMessages.some((msg) =>
				msg.text.toLowerCase().includes("profile picture"),
			) &&
			lastAiMessage.includes("go ahead and upload")
		) {
			setShowImageUpload(true);
			return;
		}

		// If user typed "skip" after profile picture question
		if (
			(lastUserMessage.includes("skip") ||
				lastUserMessage.includes("no") ||
				lastUserMessage.includes("no thanks")) &&
			aiMessages.some((msg) =>
				msg.text.toLowerCase().includes("profile picture"),
			)
		) {
			setAskfinish(true);
			setCanfinish(true);
			return;
		}

		// Check if we have advanced screening assessment data in the conversation
		const _hasAdvancedScreening = aiMessages.some(
			(msg) =>
				msg.text.includes("Advanced Screening Question:") ||
				msg.text.includes("**ASSESSMENT DATA"),
		);

		// The type 0 check handles CV upload detection, so we don't need to override it here
		// The type 0 check will properly set cv_upload to true when the AI asks for CV upload
	};
	const handleEnd = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		try {
			// Extract application data from chat history
			const extractedData = await extractApplicationDataFromChat(
				listData,
				opportunity.questions,
			);

			// Calculate AI score from advancedScreening
			const { advancedScreening } = extractedData;
			const aiScore =
				advancedScreening && advancedScreening.length > 0
					? Math.round(
							(advancedScreening.reduce(
								(sum: number, q: { score?: number }) => sum + (q.score || 0),
								0,
							) /
								advancedScreening.length) *
								10, // Convert 1-10 scale to 1-100 scale
						)
					: null;

			// Save application to database
			const response = await fetch("/api/application/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					opportunityId: opportunity.id,
					organizationId: opportunity.organizationId,
					name: extractedData.name,
					email: extractedData.email,
					phone: extractedData.phone,
					education: extractedData.education,
					experience: extractedData.experience,
					portfolioUrl: extractedData.portfolioUrl,
					travelWillingness: extractedData.travelWillingness,
					resumeUrl: resumeUrl,
					image: imageUrl,
					submissionData: {
						answers: extractedData.answers,
						chatHistory: listData,
						questions: opportunity.questions,
						advancedScreening: extractedData.advancedScreening,
					},
					aiScore, // <-- new field
				}),
			});

			if (response.ok) {
				const result = await response.json();
				console.log("Application saved:", result);

				// Show completion message
				const textFromResponse_obj = {
					text: "Thank you for applying! We will review your application and inform you about the following steps. Good luck!",
					sender: "ai",
				};
				setListData([...listData, textFromResponse_obj]);
				setLoading(false);
				setAskfinish(false);
				setApplicationCompleted(true); // Mark application as completed
			} else {
				console.error("Failed to save application");
				setLoading(false);
			}
		} catch (error) {
			console.error("Error saving application:", error);
			setLoading(false);
		}
	};

	const handleContinue = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAskfinish(false);
	};

	const handlefileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault();
			const formData = new FormData();
			formData.append("file", selectedFile!);
			formData.append("uuid", uniqueIdRef.current);
			setLoading(true);

			fetch("/api/upload", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					if (data.fileUrl) {
						setResumeUrl(data.fileUrl);
					}
				})
				.catch((error) => console.error(error));

			setCvUpload(false);

			const response = await fetch("/api/addToRedisList", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					channel_name: uniqueIdRef.current,
					text: "I uploaded the CV.",
					type: 1,
					ai_output: "",
					opportunityId: opportunity.id,
				}),
			});

			if (response.ok) {
				// Create a streaming response handler
				const reader = response.body?.getReader();
				const decoder = new TextDecoder("utf-8");
				let accumulatedText = "";

				// Add a placeholder AI message that will be updated
				setListData((prev) => [...prev, { text: "", sender: "ai" }]);

				if (reader) {
					try {
						while (true) {
							const { done, value } = await reader.read();

							if (done) break;

							const chunk = decoder.decode(value, { stream: true });
							accumulatedText += chunk;

							// Update the last AI message with accumulated text
							setListData((prev) => {
								const newList = [...prev];
								const lastMessage = newList[newList.length - 1];
								if (lastMessage && lastMessage.sender === "ai") {
									lastMessage.text = accumulatedText;
								}
								return newList;
							});
						}
					} finally {
						reader.releaseLock();
					}
				}

				setLoading(false);

				const response2 = await fetch("/api/addToRedisList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						channel_name: uniqueIdRef.current,
						text: "I uploaded the CV.",
						type: 2,
						ai_output: accumulatedText,
						opportunityId: opportunity.id,
					}),
				});

				if (response2.ok) {
					// Don't immediately show image upload - let AI ask first
					// The AI response should prompt for profile picture
					// setShowImageUpload(true); // Removed - will be triggered by AI's response
				} else {
					console.error("Failed to save chat history.");
				}
			} else {
				console.error("Failed to receive answer from backend3.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	const handleImageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault();
			const formData = new FormData();
			formData.append("file", selectedImageFile!);
			formData.append("uuid", uniqueIdRef.current);
			setLoading(true);

			fetch("/api/upload-image", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					if (data.fileUrl) {
						setImageUrl(data.fileUrl);
					}
				})
				.catch((error) => console.error(error));

			setShowImageUpload(false);

			const response = await fetch("/api/addToRedisList", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					channel_name: uniqueIdRef.current,
					text: "I uploaded my profile picture.",
					type: 1,
					ai_output: "",
					opportunityId: opportunity.id,
				}),
			});

			if (response.ok) {
				// Create a streaming response handler
				const reader = response.body?.getReader();
				const decoder = new TextDecoder("utf-8");
				let accumulatedText = "";

				// Add a placeholder AI message that will be updated
				setListData((prev) => [...prev, { text: "", sender: "ai" }]);

				if (reader) {
					try {
						while (true) {
							const { done, value } = await reader.read();

							if (done) break;

							const chunk = decoder.decode(value, { stream: true });
							accumulatedText += chunk;

							// Update the last AI message with accumulated text
							setListData((prev) => {
								const newList = [...prev];
								const lastMessage = newList[newList.length - 1];
								if (lastMessage && lastMessage.sender === "ai") {
									lastMessage.text = accumulatedText;
								}
								return newList;
							});
						}
					} finally {
						reader.releaseLock();
					}
				}

				setLoading(false);

				const response2 = await fetch("/api/addToRedisList", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						channel_name: uniqueIdRef.current,
						text: "I uploaded my profile picture.",
						type: 2,
						ai_output: accumulatedText,
						opportunityId: opportunity.id,
					}),
				});

				if (response2.ok) {
					setAskfinish(true);
					setCanfinish(true);
				} else {
					console.error("Failed to save chat history.");
				}
			} else {
				console.error("Failed to receive answer from backend.");
			}
		} catch (error) {
			console.error("Error submitting image:", error);
		}
	};

	const listContainerRef = useRef<HTMLDivElement | null>(null);
	const listDataLengthRef = useRef(0);

	// Auto-scroll to bottom when new messages are added
	useEffect(() => {
		if (
			listContainerRef.current &&
			listData.length !== listDataLengthRef.current
		) {
			listDataLengthRef.current = listData.length;
			(listContainerRef.current as HTMLDivElement).scrollTop = (
				listContainerRef.current as HTMLDivElement
			).scrollHeight;
		}
	}, [listData.length]);

	function TextBubble(props: { props: ChatMessage; isLast?: boolean }) {
		const { text, sender } = props.props;
		const { isLast = false } = props;
		const isUser = sender.toLowerCase() === "user";

		// For AI messages, parse out user-facing content and hide assessment data
		let displayText = text;
		if (!isUser) {
			// Check if this is an AI response with assessment data
			const userResponseMatch = text.match(
				/\*\*USER RESPONSE[^:]*:\*\*\s*([\s\S]*?)(?=\*\*ASSESSMENT DATA|$)/i,
			);
			if (userResponseMatch) {
				// Extract only the user-facing response
				displayText = userResponseMatch[1].trim();
			} else {
				// Check for legacy format (just in case)
				const assessmentIndex = text.indexOf("Advanced Screening Question:");
				if (assessmentIndex !== -1) {
					// Split at assessment and only show the part before it
					displayText = text.substring(0, assessmentIndex).trim();
				} else {
					// Check for any **ASSESSMENT DATA** pattern and remove it
					const assessmentDataMatch = text.match(
						/\*\*ASSESSMENT DATA[^:]*:\*\*[\s\S]*$/i,
					);
					if (assessmentDataMatch) {
						// Remove the assessment data part
						displayText = text.replace(assessmentDataMatch[0], "").trim();
					}
				}
			}
		}

		// Show "Thinking..." if this is the last AI message, it's empty, and we're loading
		const showThinking = !isUser && isLast && !displayText && loading;

		return (
			<AIMessage
				from={isUser ? "user" : "assistant"}
				className={!isUser ? "items-start" : ""}
			>
				<AIMessageContent>
					{showThinking ? (
						<span className="text-muted-foreground text-sm lg:text-[15px]">
							Thinking...
						</span>
					) : (
						<div
							className={cx(
								"prose prose-neutral max-w-none text-sm lg:text-[15px] leading-relaxed",
								"prose-p:leading-relaxed prose-pre:p-0",
								"prose-h1:text-lg prose-h2:text-base prose-h3:text-sm",
								"prose-h1:font-semibold prose-h2:font-medium prose-h3:font-medium",
								"prose-strong:font-semibold prose-strong:text-foreground",
								"prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
								"prose-blockquote:border-l-border prose-blockquote:text-muted-foreground",
								"prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:underline",
							)}
						>
							<ReactMarkdown
								components={{
									// Ensure proper spacing for paragraphs
									p: ({ children, ...props }) => (
										<p className="mb-4 last:mb-0" {...props}>
											{children}
										</p>
									),
									// Ensure proper spacing for lists
									ul: ({ children, ...props }) => (
										<ul className="mb-4 space-y-2" {...props}>
											{children}
										</ul>
									),
									ol: ({ children, ...props }) => (
										<ol className="mb-4 space-y-2" {...props}>
											{children}
										</ol>
									),
									// Ensure proper spacing for list items
									li: ({ children, ...props }) => (
										<li className="leading-relaxed" {...props}>
											{children}
										</li>
									),
									// Ensure proper spacing for headings
									h1: ({ children, ...props }) => (
										<h1
											className="text-lg font-semibold mb-4 mt-6 first:mt-0"
											{...props}
										>
											{children}
										</h1>
									),
									h2: ({ children, ...props }) => (
										<h2
											className="text-base font-medium mb-3 mt-5 first:mt-0"
											{...props}
										>
											{children}
										</h2>
									),
									h3: ({ children, ...props }) => (
										<h3
											className="text-sm font-medium mb-2 mt-4 first:mt-0"
											{...props}
										>
											{children}
										</h3>
									),
									// Ensure proper spacing for strong elements
									strong: ({ children, ...props }) => (
										<strong
											className="font-semibold text-foreground"
											{...props}
										>
											{children}
										</strong>
									),
								}}
								remarkPlugins={[remarkGfm]}
							>
								{displayText}
							</ReactMarkdown>
						</div>
					)}
				</AIMessageContent>
				{!isUser && <AiLogo />}
			</AIMessage>
		);
	}

	// Debug: Log cv_upload state whenever it changes
	useEffect(() => {
		console.log("[DEBUG] cv_upload state before render:", cv_upload);
	}, [cv_upload]);

	return (
		<div className="wrapper !bg-background flex flex-col h-[100dvh]">
			{/* Header/Navbar */}
			<div className="w-full border-b bg-background shrink-0">
				<div className="flex h-12 sm:h-14 items-center px-3 sm:px-4 lg:px-6">
					<div className="flex items-center gap-2 flex-1 min-w-0">
						<a
							href="https://recruut.io"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:opacity-80 transition-opacity shrink-0"
						>
							<Logo className="size-5 sm:size-6" />
						</a>
					</div>
					<div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center min-w-0">
						<span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
							{opportunity.title}
						</span>
						{opportunity.description && (
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<Info className="size-3.5 shrink-0 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent className="max-w-xs">
									<div className="whitespace-pre-wrap text-[13px] leading-relaxed">
										{opportunity.description}
									</div>
								</TooltipContent>
							</Tooltip>
						)}
						{isOpportunityPaused && (
							<Tooltip delayDuration={0}>
								<TooltipTrigger asChild>
									<HelpCircle className="size-3.5 shrink-0 text-warning" />
								</TooltipTrigger>
								<TooltipContent className="max-w-xs">
									<div className="whitespace-pre-wrap text-[13px] leading-relaxed">
										This opportunity is currently paused.
									</div>
								</TooltipContent>
							</Tooltip>
						)}
					</div>
					<div className="flex items-center justify-end flex-1 min-w-0">
						<ThemeSwitcher />
					</div>
				</div>
			</div>

			<div className="quick-apply-container max-w-3xl mx-auto flex flex-col flex-1 min-h-0 w-full px-3 sm:px-4 lg:px-6">
				{/* <div className="mb-6 p-4 sm:p-6 bg-card border rounded-lg">
					<h1 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
						{opportunity.title} Application
					</h1>
					{opportunity.description && (
						<p className="text-sm text-muted-foreground lg:text-[15px]">
							{opportunity.description}
						</p>
					)}
				</div> */}

				<div
					className="list-container flex-1 overflow-y-auto min-h-0 py-4"
					ref={listContainerRef}
				>
					{listData.map((item, index) => (
						<TextBubble
							key={`${item.sender}-${item.text.slice(0, 50)}-${index}`}
							props={item}
							isLast={index === listData.length - 1}
						></TextBubble>
					))}
					{/* Show "Thinking..." when loading and no AI messages exist yet */}
					{loading && listData.length === 0 && (
						<AIMessage from="assistant" className="items-start">
							<AIMessageContent>
								<span className="text-muted-foreground text-sm lg:text-[15px]">
									Thinking...
								</span>
							</AIMessageContent>
							<AiLogo />
						</AIMessage>
					)}
				</div>

				<div className="form-container flex w-full shrink-0 pb-4 pt-2">
					{applicationCompleted ? (
						// Show completion message when application is finished
						<div className="w-full text-center py-6">
							<div className="bg-success/10 border border-success/20 rounded-lg p-4">
								<div className="flex items-center justify-center gap-2 text-success mb-2">
									<Check className="size-5" />
									<span className="font-medium">
										Application Submitted Successfully!
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Thank you for your application. We will review it and get back
									to you soon.
								</p>
							</div>
						</div>
					) : canfinish && askfinish ? (
						<div className="flex gap-2 sm:gap-4 w-full">
							<form onSubmit={handleEnd} className="flex-1">
								<button
									type="submit"
									disabled={loading}
									className="flex justify-center items-center w-full h-10 sm:h-12 rounded-lg border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? (
										<>
											<div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current mr-1 sm:mr-2" />
											<span className="text-xs sm:text-sm font-medium">
												Submitting...
											</span>
										</>
									) : (
										<>
											<Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
											<span className="text-xs sm:text-sm font-medium">
												Complete Application
											</span>
										</>
									)}
								</button>
							</form>
							<form onSubmit={handleContinue} className="flex-1">
								<button
									type="submit"
									className="flex justify-center items-center w-full h-10 sm:h-12 rounded-lg border bg-background hover:bg-accent transition-colors"
								>
									<HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
									<span className="text-xs sm:text-sm font-medium">
										Ask Questions
									</span>
								</button>
							</form>
						</div>
					) : cv_upload ? (
						<div className="w-full">
							<AIInput onSubmit={handlefileSubmit}>
								<AIInputTextarea
									placeholder="Please upload your resume (PDF format)"
									value=""
									readOnly
									className="cursor-pointer"
								/>
								<AIInputToolbar>
									<AIInputTools>
										<AIInputButton
											onClick={() => {
												console.log("[DEBUG] Upload Resume button clicked");
												document.getElementById("cv-upload")?.click();
											}}
										>
											<FileText size={16} />
											<span>Upload Resume</span>
										</AIInputButton>
									</AIInputTools>
									<AIInputSubmit disabled={!selectedFile} />
								</AIInputToolbar>
							</AIInput>
							<input
								id="cv-upload"
								type="file"
								accept=".pdf"
								onChange={handleFileInputChange}
								className="hidden"
								required
							/>
						</div>
					) : showImageUpload ? (
						<div className="w-full">
							<AIInput onSubmit={handleImageSubmit}>
								<AIInputTextarea
									placeholder="Please upload your profile picture (optional)"
									value=""
									readOnly
									className="cursor-pointer"
								/>
								<AIInputToolbar>
									<AIInputTools>
										<AIInputButton
											onClick={() =>
												document.getElementById("image-upload")?.click()
											}
										>
											<Image size={16} />
											<span>Upload Photo</span>
										</AIInputButton>
									</AIInputTools>
									<AIInputSubmit disabled={!selectedImageFile} />
								</AIInputToolbar>
							</AIInput>
							<input
								id="image-upload"
								type="file"
								accept="image/*"
								onChange={handleImageInputChange}
								className="hidden"
							/>
						</div>
					) : (
						<div className="w-full">
							<AIInput onSubmit={handletextSubmit}>
								<AIInputTextarea
									placeholder={
										isOpportunityPaused
											? "This opportunity is paused"
											: "Enter your answer..."
									}
									value={inputText}
									onChange={(e) => setInputText(e.target.value)}
									className="max-h-[64px]"
									disabled={isOpportunityPaused}
								/>
								<AIInputToolbar>
									<AIInputTools>
										<AIInputButton disabled={isOpportunityPaused}>
											<Plus size={16} />
										</AIInputButton>
									</AIInputTools>
									<AIInputSubmit
										disabled={!inputText.trim() || isOpportunityPaused}
									/>
								</AIInputToolbar>
							</AIInput>
						</div>
					)}
				</div>
				<PoweredBy />
			</div>
		</div>
	);
}
