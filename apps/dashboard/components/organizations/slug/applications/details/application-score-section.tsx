"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import type * as React from "react";
import type { ApplicationDto } from "~/types/dtos/application-dto";

export type ApplicationScoreSectionProps = {
	application: ApplicationDto;
};

export function ApplicationScoreSection({
	application,
}: ApplicationScoreSectionProps): React.JSX.Element {
	return (
		<div className="p-6">
			<h3 className="text-sm font-medium mb-4">AI Assessment</h3>
			<div className="space-y-4">
				{application.aiScore !== undefined && (
					<div>
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-muted-foreground">AI Score</span>
							<span className="text-sm font-medium">
								{application.aiScore}/100
							</span>
						</div>
						<Progress value={application.aiScore * 10} className="h-2" />
					</div>
				)}
				{application.aiFlag && (
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">AI Flag</span>
						<Badge
							variant={
								application.aiFlag === "great"
									? "default"
									: application.aiFlag === "spam" ||
											application.aiFlag === "scam"
										? "destructive"
										: "secondary"
							}
						>
							{application.aiFlag}
						</Badge>
					</div>
				)}
				{application.manualFlag && (
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Manual Flag</span>
						<Badge variant="outline">{application.manualFlag}</Badge>
					</div>
				)}
			</div>
		</div>
	);
}
