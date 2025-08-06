import { Card } from "@workspace/ui/components/card";
import { CurrencyIllustration } from "../fragments/currency-illustration";
import { MapIllustration } from "../fragments/map-illustration";
import { NotificationIllustration } from "../fragments/notification-illustration";
import { ReplyIllustration } from "../fragments/reply-illustration";
import { VizualizationIllustration } from "../fragments/vizualization-illustration";

export default function Bento() {
	return (
		<section className="@container py-12">
			<h2 className="sr-only">Features</h2>
			<div className="mx-auto w-full max-w-6xl px-6 lg:px-12">
				<div className="@xl:grid-cols-2 @3xl:grid-cols-6 grid gap-4 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
					<Card className="@3xl:col-span-2 grid grid-rows-[1fr_auto] gap-y-12 overflow-hidden rounded-2xl p-8">
						<div className="relative -m-8 p-8">
							<Stripes />
							<NotificationIllustration
								variant="mixed"
								className="*:!rounded-2xl"
							/>
						</div>
						<div>
							<h3 className="text-foreground font-semibold">
								Scheduled Reports
							</h3>
							<p className="text-muted-foreground mt-3">
								Automate report delivery to stakeholders with customizable
								scheduling options.
							</p>
						</div>
					</Card>
					<Card className="@3xl:col-span-2 grid grid-rows-[1fr_auto] gap-y-12 overflow-hidden rounded-2xl p-8">
						<div className="bg-linear-to-b border-background relative -m-8 border-x from-transparent via-rose-50 to-transparent p-8">
							<Stripes />
							<CurrencyIllustration />
						</div>
						<div>
							<h3 className="text-foreground font-semibold">
								Collaborative Analysis
							</h3>
							<p className="text-muted-foreground mt-3">
								Add comments, share insights, and work together with your team
								to extract maximum.
							</p>
						</div>
					</Card>
					<Card className="@xl:col-span-2 grid grid-rows-[1fr_auto] gap-y-12 overflow-hidden rounded-2xl p-8">
						<div className="bg-linear-to-b border-background relative -m-8 border-x from-transparent via-sky-50 to-transparent p-8">
							<Stripes />
							<ReplyIllustration className="relative mt-0 w-full" />
						</div>
						<div>
							<h3 className="text-foreground font-semibold">
								Collaborative Analysis
							</h3>
							<p className="text-muted-foreground mt-3">
								Add comments, share insights, and work together with your team
								to extract maximum.
							</p>
						</div>
					</Card>
					<Card className="@xl:col-span-2 @3xl:col-span-3 grid grid-rows-[1fr_auto] gap-8 rounded-2xl p-8">
						<div className="bg-linear-to-b relative -m-8 from-transparent via-zinc-50 to-transparent p-8">
							<VizualizationIllustration />
						</div>
						<div>
							<h3 className="text-foreground font-semibold">
								Interactive Dashboards
							</h3>
							<p className="text-muted-foreground mt-3">
								Create custom dashboards with drag-and-drop simplicity. Combine
								multiple visualization types to get a complete view of your data
								story.
							</p>
						</div>
					</Card>
					<Card className="@xl:col-span-2 @3xl:col-span-3 grid grid-rows-[1fr_auto] gap-8 rounded-2xl p-8">
						<div className="relative -mx-8 [--color-background:transparent] [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)]">
							<MapIllustration />
						</div>
						<div>
							<h3 className="text-foreground font-semibold">
								Scheduled Reports
							</h3>
							<p className="text-muted-foreground mt-3">
								Create custom dashboards with drag-and-drop simplicity. Combine
								multiple visualization types to get a complete view of your data
								story.
							</p>
						</div>
					</Card>
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
