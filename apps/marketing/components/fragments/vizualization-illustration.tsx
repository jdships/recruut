export const VizualizationIllustration = () => {
	return (
		<div
			aria-hidden
			className="mask-b-from-65% before:bg-background before:border-border after:border-border after:bg-background/50 before:z-1 group relative -mx-4 px-4 pt-6 before:absolute before:inset-x-6 before:bottom-0 before:top-4 before:rounded-2xl before:border after:absolute after:inset-x-9 after:bottom-0 after:top-2 after:rounded-2xl after:border"
		>
			<div className="bg-background relative z-10 rounded-2xl border p-6 shadow-lg">
				<div className="text-foreground font-medium">
					<span className="bg-blue-500/20 py-1 px-1 rounded-md text-blue-500">
						Pipeline
					</span>{" "}
					Performance
				</div>
				<div className="text-muted-foreground mt-0.5 text-sm">
					Candidates by hiring stage completion
				</div>
				<div className="relative mb-4 mt-4 flex">
					<div className="h-5 w-3/5 rounded-l-md bg-[color-mix(in_oklab,var(--color-foreground)50%,var(--color-primary))]" />
					<div className="bg-primary h-5 w-1/6 duration-300 group-hover:w-1/3" />
					<div className="h-5 w-1/4 rounded-r-md border duration-300 [--stripes-color:theme(colors.zinc.300)] [background-image:linear-gradient(-45deg,var(--stripes-color)_25%,transparent_25%,transparent_50%,var(--stripes-color)_50%,var(--stripes-color)_75%,transparent_75%,transparent)] [background-size:5px_5px] group-hover:w-1/6" />
				</div>
				<div className="flex gap-1 border-b border-dashed pb-3">
					<div className="w-3/4">
						<div className="text-foreground text-xl font-medium">72%</div>
						<div className="text-muted-foreground text-sm">Hired</div>
					</div>
					<div className="w-1/4">
						<div className="text-foreground text-xl font-medium">28%</div>
						<div className="text-muted-foreground text-sm">In Progress</div>
					</div>
				</div>
				<div className="mt-3 space-y-1">
					<div className="flex items-center gap-2">
						<div className="size-1.5 rounded-full bg-[color-mix(in_oklab,var(--color-foreground)50%,var(--color-primary))]"></div>
						<div className="text-sm font-medium">
							Screening <span className="text-muted-foreground">(18%)</span>{" "}
							average of 3.2 days
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="bg-primary size-1.5 rounded-full"></div>
						<div className="text-sm font-medium">
							Interviews <span className="text-muted-foreground">(54%)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
