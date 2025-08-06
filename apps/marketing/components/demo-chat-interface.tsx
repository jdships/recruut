"use client";

import { Logo } from "@workspace/ui/components/logo";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	type: "ai" | "user";
	content: string | string[];
	delay?: number;
}

const messages: Message[] = [
	{
		id: "1",
		type: "ai",
		content:
			"Hello! I am an AI powered recruiting assistant for Recruut. I will help with your application process. Before we get started, may I know your name, please?",
		delay: 1000,
	},
	{
		id: "2",
		type: "user",
		content: "my name is Logan",
		delay: 2000,
	},
	{
		id: "3",
		type: "ai",
		content: "Great, thank you, Logan. May I have your email address, please?",
		delay: 1500,
	},
	{
		id: "4",
		type: "user",
		content: "logan.roy@gmail.com",
		delay: 2500,
	},
	{
		id: "5",
		type: "ai",
		content:
			"Thank you for providing your email, Logan. Let's continue with the application process.",
		delay: 2000,
	},
	{
		id: "6",
		type: "ai",
		content: "What is your phone number?",
		delay: 1500,
	},
	{
		id: "7",
		type: "user",
		content: "+123 456 7890",
		delay: 2500,
	},
	{
		id: "8",
		type: "ai",
		content:
			"Perfect! Now, tell me about your relevant experience for this position.",
		delay: 1500,
	},
	{
		id: "9",
		type: "user",
		content:
			"I have 5+ years of experience in software engineering, primarily working with React, TypeScript, and Node.js. I've led several full-stack projects and have experience with cloud deployment on AWS.",
		delay: 3000,
	},
	{
		id: "10",
		type: "ai",
		content: "Excellent background! What is your educational background?",
		delay: 1500,
	},
	{
		id: "11",
		type: "user",
		content:
			"I have a Bachelor's degree in Computer Science from Stanford University, graduated in 2018.",
		delay: 2500,
	},
	{
		id: "12",
		type: "ai",
		content: "Great! Do you have a portfolio or website you'd like to share?",
		delay: 1500,
	},
	{
		id: "13",
		type: "user",
		content: "Yes, you can check out my work at logan-portfolio.dev",
		delay: 2000,
	},
	{
		id: "14",
		type: "ai",
		content:
			"Thank you for sharing! Are you willing to travel if required for this role?",
		delay: 1500,
	},
	{
		id: "15",
		type: "user",
		content: "Yes, I'm open to travel up to 25% of the time.",
		delay: 2000,
	},
	{
		id: "16",
		type: "ai",
		content:
			"Perfect! Last question: Can you describe a challenging technical problem you solved recently and how you approached it?",
		delay: 1500,
	},
	{
		id: "17",
		type: "user",
		content:
			"Recently, I optimized a React application that was experiencing performance issues. I identified unnecessary re-renders using React DevTools, implemented useMemo and useCallback hooks strategically, and reduced bundle size by code splitting. This improved load time by 40%.",
		delay: 4000,
	},
	{
		id: "18",
		type: "ai",
		content:
			"Excellent problem-solving approach! Now that we've covered the key questions, could you please upload your CV/resume? This will help us better understand your background and experience.",
		delay: 2000,
	},
	{
		id: "19",
		type: "user",
		content: "logan-resume.pdf",
		delay: 3000,
	},
	{
		id: "20",
		type: "ai",
		content:
			"Perfect! I've received your resume. As a final optional step, would you like to upload a profile picture? This helps recruiters put a face to your application. You can type 'yes' to upload one or 'skip' to finish your application.",
		delay: 1500,
	},
	{
		id: "21",
		type: "user",
		content: "skip",
		delay: 2000,
	},
	{
		id: "22",
		type: "ai",
		content:
			"Thank you for completing your application, Logan! 🎉\n\nOur recruitment team will review your profile and get back to you within 2-3 business days.\n\nGood luck with your application!",
		delay: 1500,
	},
];

const TypewriterText = ({
	text,
	onComplete,
}: {
	text: string;
	onComplete?: () => void;
}) => {
	const [displayedText, setDisplayedText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (currentIndex < text.length) {
			const timeout = setTimeout(() => {
				setDisplayedText((prev) => prev + text[currentIndex]);
				setCurrentIndex((prev) => prev + 1);
			}, 20);
			return () => clearTimeout(timeout);
		} else if (onComplete) {
			onComplete();
		}
	}, [currentIndex, text, onComplete]);

	return <span>{displayedText}</span>;
};

export function DemoChatInterface() {
	const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
	const [showTyping, setShowTyping] = useState(false);
	const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
	const [isTypingText, setIsTypingText] = useState(false);
	const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
	const [applicationCompleted, setApplicationCompleted] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Auto-scroll function with smooth behavior
	const scrollToBottom = useCallback(() => {
		if (scrollContainerRef.current) {
			requestAnimationFrame(() => {
				if (scrollContainerRef.current) {
					scrollContainerRef.current.scrollTo({
						top: scrollContainerRef.current.scrollHeight,
						behavior: "smooth",
					});
				}
			});
		}
	}, []);

	useEffect(() => {
		if (currentMessageIndex >= messages.length) return;

		const currentMessage = messages[currentMessageIndex];
		const delay = currentMessage.delay;

		const timer = setTimeout(() => {
			if (currentMessage.type === "ai") {
				// Add the message immediately with typing state
				setVisibleMessages((prev) => [...prev, currentMessage]);
				setShowTyping(true);

				// Then start the text streaming after a delay
				setTimeout(() => {
					setShowTyping(false);
					setIsTypingText(true);
					setCurrentParagraphIndex(0);
					// Scroll after content starts streaming
					requestAnimationFrame(() => {
						setTimeout(scrollToBottom, 100);
					});
				}, 1200);
			} else {
				// User messages appear immediately
				setVisibleMessages((prev) => [...prev, currentMessage]);
				setCurrentMessageIndex((prev) => prev + 1);
				// Use requestAnimationFrame for smooth scroll timing
				requestAnimationFrame(() => {
					setTimeout(scrollToBottom, 100);
				});
			}
		}, delay);

		return () => clearTimeout(timer);
	}, [currentMessageIndex, scrollToBottom]);

	// Scroll to bottom when application is completed to show success message
	useEffect(() => {
		if (applicationCompleted) {
			console.log("Application completed, triggering scroll");
			// Multiple scroll attempts with longer delays to ensure success message is visible
			setTimeout(() => {
				requestAnimationFrame(() => {
					scrollToBottom();
				});
			}, 200);

			setTimeout(() => {
				requestAnimationFrame(() => {
					scrollToBottom();
				});
			}, 600);

			setTimeout(() => {
				requestAnimationFrame(() => {
					scrollToBottom();
				});
			}, 1000);
		}
	}, [applicationCompleted, scrollToBottom]);

	const handleTypingComplete = () => {
		const currentMessage = visibleMessages[visibleMessages.length - 1];

		if (Array.isArray(currentMessage.content)) {
			// If there are more paragraphs to type
			if (currentParagraphIndex < currentMessage.content.length - 1) {
				setCurrentParagraphIndex((prev) => prev + 1);
				return;
			}
		}

		// All paragraphs completed or single paragraph completed
		setIsTypingText(false);

		// Check if this is the final message (completion message)
		if (currentMessage.id === "22") {
			console.log("Setting application completed to true");
			setApplicationCompleted(true);
		}

		setCurrentMessageIndex((prev) => prev + 1);
		// Use requestAnimationFrame for smooth transition to next message
		requestAnimationFrame(() => {
			setTimeout(scrollToBottom, 100);
		});
	};

	return (
		<div className="bg-background/90 inset-ring-1 inset-ring-background border-border w-full lg:max-w-lg rounded-lg border shadow-xs backdrop-blur-3xl overflow-hidden">
			{/* Header */}
			<div className="flex h-12 items-center px-4 border-b border-border bg-background/50">
				<div className="flex items-center gap-2 flex-1">
					<Logo hideWordmark className="size-5" />
				</div>
				<div className="flex items-center gap-1 flex-1 justify-center">
					<span className="text-sm font-medium text-foreground truncate">
						Software Engineer - Recruut
					</span>
				</div>
				<div className="flex items-center justify-end flex-1">
					<div className="flex gap-1">
						<div className="bg-foreground/20 size-2 rounded-full" />
						<div className="bg-foreground/20 size-2 rounded-full" />
						<div className="bg-foreground/20 size-2 rounded-full" />
					</div>
				</div>
			</div>

			{/* Chat Messages */}
			<div
				ref={scrollContainerRef}
				className="px-4 pt-4 pb-8 space-y-4 h-80 overflow-y-auto overflow-x-hidden scrollbar-hide"
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				<style>{`
          div::-webkit-scrollbar {
            display: none;
          }
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(8px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          /* Smooth transitions for all message elements */
          .message-content {
            transition: all 0.2s ease-out;
          }
          /* Typing indicator animation */
          @keyframes pulse-dot {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>

				{visibleMessages.map((message, index) => (
					<div
						key={message.id}
						className={`${message.type === "user" ? "flex justify-end" : "flex gap-3"} opacity-0 animate-fadeIn`}
						style={{
							animationDelay: "0.1s",
							animationFillMode: "forwards",
						}}
					>
						{message.type === "ai" ? (
							<>
								<div className="flex size-6 shrink-0 items-center justify-center bg-primary rounded-lg border text-sm font-medium text-primary-foreground">
									R
								</div>
								<div className="flex-1 message-content">
									{showTyping && index === visibleMessages.length - 1 ? (
										// Show typing bubbles for the last AI message when typing
										<div className="flex gap-1 items-center h-6">
											<div
												className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
												style={{
													animation: "pulse-dot 1.5s ease-in-out infinite",
													animationDelay: "0s",
												}}
											></div>
											<div
												className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
												style={{
													animation: "pulse-dot 1.5s ease-in-out infinite",
													animationDelay: "0.5s",
												}}
											></div>
											<div
												className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full"
												style={{
													animation: "pulse-dot 1.5s ease-in-out infinite",
													animationDelay: "1s",
												}}
											></div>
										</div>
									) : Array.isArray(message.content) ? (
										message.content.map((text, textIndex) => {
											// Only show paragraphs up to the current one being typed
											if (
												isTypingText &&
												index === visibleMessages.length - 1 &&
												textIndex > currentParagraphIndex
											) {
												return null;
											}

											return (
												<p
													key={`${message.id}-${textIndex}`}
													className={`text-sm leading-relaxed ${textIndex > 0 ? "mt-2" : ""}`}
												>
													{isTypingText &&
													index === visibleMessages.length - 1 &&
													textIndex === currentParagraphIndex ? (
														<TypewriterText
															key={text}
															text={text}
															onComplete={handleTypingComplete}
														/>
													) : (
														text
													)}
												</p>
											);
										})
									) : (
										<p className="text-sm leading-relaxed">
											{isTypingText && index === visibleMessages.length - 1 ? (
												<TypewriterText
													key={message.content}
													text={message.content}
													onComplete={handleTypingComplete}
												/>
											) : (
												message.content
											)}
										</p>
									)}
								</div>
							</>
						) : (
							<div className="max-w-[80%] message-content">
								<p className="border-border bg-foreground/5 rounded-2xl rounded-br-md border p-3 text-sm">
									{message.content}
								</p>
							</div>
						)}
					</div>
				))}

				{/* Invisible div to help with scrolling */}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="bg-background/50 border-t border-border">
				<div className="px-4 py-2 bg-muted">
					<p className="text-center text-xs text-muted-foreground">
						AI-powered recruiting assistant by{" "}
						<span className="font-medium text-foreground">Recruut</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default DemoChatInterface;
