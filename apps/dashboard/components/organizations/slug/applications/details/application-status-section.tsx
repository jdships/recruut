"use client";

import { Badge } from "@workspace/ui/components/badge";
import type * as React from "react";
import type { ApplicationDto } from "~/types/dtos/application-dto";

export type ApplicationStatusSectionProps = {
	application: ApplicationDto;
};

export function ApplicationStatusSection({
	application,
}: ApplicationStatusSectionProps): React.JSX.Element {
	return (
		<div className="p-6">
			<h3 className="text-sm font-medium mb-4">Application Status</h3>
			<div className="space-y-2">
				{application.status && (
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Status</span>
						<Badge variant="outline">{application.status}</Badge>
					</div>
				)}
				{application.opportunityTitle && (
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Position</span>
						<span className="text-sm font-medium">
							{application.opportunityTitle}
						</span>
					</div>
				)}
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">Applied</span>
					<span className="text-sm font-medium">
						{new Date(application.createdAt).toLocaleDateString()}
					</span>
				</div>
			</div>
		</div>
	);
}
