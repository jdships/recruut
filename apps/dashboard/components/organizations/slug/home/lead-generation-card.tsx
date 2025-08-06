"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	type CardProps,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { cn } from "@workspace/ui/lib/utils";
import { BarChart2 } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { LeadGenerationDataPointDto } from "~/types/dtos/lead-generation-data-point-dto";

const chartConfig = {
	applications: {
		label: "Applications",
		color: "var(--chart-1)",
	},
	shortlisted: {
		label: "Shortlisted",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export type LeadGenerationCardProps = CardProps & {
	data: LeadGenerationDataPointDto[];
	user: { id: string; name?: string; email?: string };
};

export function LeadGenerationCard({
	data,
	user: _user,
	className,
	...other
}: LeadGenerationCardProps): React.JSX.Element {
	const [activeChart, setActiveChart] =
		useState<keyof typeof chartConfig>("applications");

	const total = useMemo(
		() => ({
			applications: data.reduce((acc, curr) => acc + curr.applications, 0),
			shortlisted: data.reduce((acc, curr) => acc + curr.shortlisted, 0),
		}),
		[data],
	);

	return (
		<Card className={cn("pt-0", className)} {...other}>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle className="text-sm">Applications</CardTitle>
					<CardDescription>
						Summary of your applications and shortlisted candidates.
					</CardDescription>
				</div>
				<div className="flex">
					{["applications", "shortlisted"].map((value) => {
						const chart = value as keyof typeof chartConfig;
						return (
							<button
								type="button"
								key={chart}
								data-active={activeChart === chart}
								className="cursor-pointer relative z-10 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
								onClick={() => setActiveChart(chart)}
							>
								<span
									suppressHydrationWarning
									className="text-xs text-muted-foreground"
								>
									{chartConfig[chart].label}
								</span>
								<span
									suppressHydrationWarning
									className="text-lg font-bold leading-none sm:text-2xl"
								>
									{total[value as keyof typeof total].toLocaleString()}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="px-6 pt-6">
				{data.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-[250px] text-center gap-2">
						<div className="flex size-12 items-center justify-center rounded-md border">
							<BarChart2 className="size-6 shrink-0 text-muted-foreground" />
						</div>
						<p className="mt-2 text-base font-medium text-foreground">
							No data to show
						</p>
						<p className="text-sm text-muted-foreground">
							Data may take up to 24 hours to load
						</p>
					</div>
				) : (
					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-[250px] w-full"
					>
						<BarChart
							accessibilityLayer
							data={data}
							margin={{ left: 12, right: 12 }}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) =>
									new Date(value).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})
								}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="w-[150px]"
										nameKey={activeChart}
										labelFormatter={(value) =>
											new Date(value).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})
										}
									/>
								}
							/>
							<Bar
								dataKey={activeChart}
								fill={chartConfig[activeChart].color}
							/>
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
