"use client";

import { Button } from "@workspace/ui/components/button";
import { CenteredSpinner } from "@workspace/ui/components/spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AgentChat from "../components/agent-chat";

type Opportunity = {
	id: string;
	title: string;
	description: string;
	questions: string[];
	organizationId: string;
	createdAt: string;
	updatedAt: string;
	positionLink: string | null;
	documents: unknown[];
	hiringManagerEmail: string | null;
	moreContext: string | null;
};

export default function ApplyPage() {
	const params = useParams() ?? {};
	const opportunityId = (params as Record<string, string>).opportunityId;
	const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submissionLimitReached, setSubmissionLimitReached] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchOpportunity = async () => {
			try {
				const response = await fetch(`/api/opportunity/${opportunityId}`);
				if (!response.ok) {
					throw new Error("Opportunity not found");
				}
				const data = await response.json();
				setOpportunity(data);

				// Check submission limits after opportunity is loaded
				try {
					const limitResponse = await fetch(
						`/api/submission-limits/${opportunityId}`,
					);
					if (limitResponse.ok) {
						const limitData = await limitResponse.json();
						if (!limitData.canAccept) {
							setSubmissionLimitReached(true);
							setError("This opportunity has reached its application limit");
						}
					}
				} catch (limitError) {
					console.error("Error checking submission limits:", limitError);
					// Continue without blocking if limit check fails
				}
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred");
				}
			} finally {
				setLoading(false);
			}
		};

		if (opportunityId) {
			fetchOpportunity();
		}
	}, [opportunityId]);

	// Set dynamic title when opportunity data loads
	useEffect(() => {
		if (opportunity?.title) {
			document.title = `${opportunity.title} - Recruut`;
		}
	}, [opportunity]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<CenteredSpinner size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col py-32 items-center justify-center text-center min-h-screen bg-background">
				<span className="text-[10rem] font-semibold leading-none text-primary">
					{submissionLimitReached ? "🚫" : "404"}
				</span>
				<h2 className="font-heading my-2 text-2xl font-bold">
					{submissionLimitReached
						? "Applications Closed"
						: "Opportunity not found"}
				</h2>
				<p>
					{submissionLimitReached
						? "This opportunity has reached its application limit and is no longer accepting new applications."
						: "Sorry, the opportunity you are looking for doesn't exist or has been moved."}
				</p>
				<div className="mt-8 flex justify-center gap-2">
					<Button
						type="button"
						variant="default"
						size="lg"
						onClick={() => router.back()}
					>
						Go back
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="lg"
						onClick={() => router.push("/")}
					>
						Back to Home
					</Button>
				</div>
			</div>
		);
	}

	if (!opportunity) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-600 mb-4">
						Opportunity Not Found
					</h1>
					<p className="text-gray-600">
						The opportunity you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	return <AgentChat opportunity={opportunity} />;
}
