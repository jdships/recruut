import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import * as React from "react";

export function OpportunitySkeletonCard({ className }: { className?: string }) {
	return (
		<Card
			className={
				"w-full flex flex-col justify-between p-0 " + (className ?? "")
			}
		>
			<div className="p-2">
				<div className="h-28">
					<Skeleton className="h-full w-full rounded bg-muted" />
				</div>
				<div className="px-2 pb-2 pt-4">
					<div className="truncate text-base font-semibold">
						<Skeleton className="h-5 w-3/4 mb-2" />
					</div>
					<div className="mt-2 text-sm">
						<Skeleton className="h-4 w-1/2" />
					</div>
				</div>
			</div>
			<div className="flex justify-between border-t border-border px-4 py-3">
				<div className="flex items-center gap-1">
					<div className="flex -space-x-1 overflow-hidden">
						<Skeleton className="inline-block h-5 w-5 rounded-full ring-2 ring-background" />
						<Skeleton className="inline-block h-5 w-5 rounded-full ring-2 ring-background" />
						<Skeleton className="inline-block h-5 w-5 rounded-full ring-2 ring-background" />
					</div>
					<Skeleton className="ml-2 h-5 w-8 rounded-full" />
				</div>
				<Skeleton className="h-5 w-16 rounded" />
			</div>
		</Card>
	);
}
