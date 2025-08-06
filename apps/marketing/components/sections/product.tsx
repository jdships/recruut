"use client";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { CurrencyIllustration } from "../fragments/currency-illustration";
import { LayoutIllustration } from "../fragments/layout-illustration";
import { MapIllustration } from "../fragments/map-illustration";
import { NotificationIllustration } from "../fragments/notification-illustration";
import { ReplyIllustration } from "../fragments/reply-illustration";
import { VizualizationIllustration } from "../fragments/vizualization-illustration";

export default function ContentSection() {
	return (
		<section>
			<div className="py-12" id="product">
				<div className="@container mx-auto w-full max-w-6xl px-6 lg:px-12">
					<div>
						<h2 className="text-foreground mt-4 text-4xl font-semibold">
							Recruitment Automation Platform
						</h2>
						<p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">
							Recruut transforms hiring with AI-powered automation. Generate
							custom application flows, screen candidates instantly, and manage
							your pipeline—all in one place.
						</p>
					</div>

					<div className="@xl:grid-cols-2 @3xl:grid-cols-6 grid gap-4 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
						<Card className="@3xl:col-span-2 grid grid-rows-[1fr_auto] gap-y-12 overflow-hidden rounded-lg p-8">
							<div className="relative -m-8 p-8">
								<Stripes />
								<NotificationIllustration
									variant="mixed"
									className="*:!rounded-2xl"
								/>
							</div>
							<div>
								<h3 className="text-foreground font-semibold">
									Resume Processing
								</h3>
								<p className="text-muted-foreground mt-3">
									Automatically parse and extract key information from resumes
									and CVs. AI-powered analysis speeds up candidate screening.
								</p>
							</div>
						</Card>
						<Card className="@3xl:col-span-2 grid grid-rows-[1fr_auto] gap-y-12 overflow-hidden rounded-lg p-8">
							<div className="bg-linear-to-b border-background relative -m-8 border-x from-transparent via-rose-500/10 to-transparent p-8">
								<Stripes />
								<CurrencyIllustration />
							</div>
							<div>
								<h3 className="text-foreground font-semibold">
									Offer Management
								</h3>
								<p className="text-muted-foreground mt-3">
									Streamline compensation planning and offer generation. Create
									competitive packages and track offer acceptance rates.
								</p>
							</div>
						</Card>
						<Card className="@xl:col-span-2 grid grid-rows-[1fr_auto] gap-y-12 overflow-hidden rounded-lg p-8">
							<div className="bg-linear-to-b border-background relative -m-8 border-x from-transparent via-sky-500/10 to-transparent p-8">
								<Stripes />
								<ReplyIllustration className="relative mt-0 w-full" />
							</div>
							<div>
								<h3 className="text-foreground font-semibold">
									Team Collaboration
								</h3>
								<p className="text-muted-foreground mt-3">
									Share candidate insights, collaborate on hiring decisions, and
									keep your recruitment team aligned throughout the process.
								</p>
							</div>
						</Card>
						<Card className="@xl:col-span-2 @3xl:col-span-3 grid grid-rows-[1fr_auto] gap-8 rounded-lg p-8">
							<div className="bg-linear-to-b relative -m-8 from-transparent via-zinc-500/10 to-transparent p-8">
								<VizualizationIllustration />
							</div>
							<div>
								<h3 className="text-foreground font-semibold">
									Recruitment Analytics
								</h3>
								<p className="text-muted-foreground mt-3">
									Track your hiring pipeline with real-time analytics. Monitor
									time-to-hire, conversion rates, and recruitment performance
									across your entire organization.
								</p>
							</div>
						</Card>
						<Card className="@xl:col-span-2 @3xl:col-span-3 grid grid-rows-[1fr_auto] gap-8 rounded-lg p-8">
							<div className="relative -mx-8 [--color-background:transparent] [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)]">
								<MapIllustration />
							</div>
							<div>
								<h3 className="text-foreground font-semibold">
									Global Talent Sourcing
								</h3>
								<p className="text-muted-foreground mt-3">
									Find and connect with top talent worldwide. Our platform helps
									you discover qualified candidates across different regions and
									time zones.
								</p>
							</div>
						</Card>
						<Card className="@xl:col-span-2 @3xl:col-span-6 relative overflow-hidden pl-8 pt-8 md:p-20 md:pl-8">
							<div className="max-w-xl max-md:pr-8">
								<div className="relative">
									<h2 className="text-balance text-3xl font-semibold md:text-4xl">
										Hire Smarter, Faster
									</h2>
									<p className="text-muted-foreground mb-6 mt-4 text-balance">
										Join thousands of recruiters and HR teams who are
										transforming their hiring process with AI-powered
										automation.
									</p>

									<Button
										size="lg"
										onClick={() => {
											document.getElementById("waitlist")?.scrollIntoView({
												behavior: "smooth",
												block: "start",
											});
										}}
									>
										Start Recruiting
									</Button>
								</div>
							</div>
							<div className="max-lg:mask-b-from-35% max-lg:pt-6 max-md:mt-4 lg:absolute lg:inset-0 lg:top-12 lg:ml-auto lg:w-2/5">
								<LayoutIllustration />
							</div>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}

const Stripes = () => (
	<div
		aria-hidden
		className="absolute -inset-x-6 inset-y-0 bg-[repeating-linear-gradient(-45deg,black,black_1px,transparent_1px,transparent_6px)] mix-blend-overlay [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
	/>
);
