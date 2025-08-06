import Image from "next/image";
import { DemoChatInterface } from "../demo-chat-interface";
import { WaitlistForm } from "../waitlist-form";

export default function HeroSection() {
	return (
		<main className="overflow-x-hidden pt-10">
			<section id="waitlist">
				<div className="relative sm:pb-36 pt-16 lg:pt-40">
					<div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-12">
						<div className="lg:w-2/3">
							<div className="flex flex-col gap-4">
								<h1 className="font-semibold text-balance text-4xl md:text-5xl sm:text-pretty select-none">
									Hire 10x Faster with <br />
									<span className="px-2 text-blue-500 bg-blue-500/20 rounded-sm">
										AI-Powered
									</span>{" "}
									Recruiting
								</h1>

								<p className="text-muted-foreground text-balance sm:text-lg text-base">
									While your competitors spend weeks manually screening resumes,
									you're already interviewing top talent.
								</p>

								<div className="max-w-md">
									<WaitlistForm variant="compact" className="w-full" />
								</div>

								<div className="flex flex-col gap-3 mt-4">
									<p className="text-muted-foreground">Trusted by teams at :</p>
									<div className="flex items-center gap-10">
										<div className="flex">
											<Image
												className="mx-auto h-4 w-fit hover:opacity-80 transition-opacity dark:invert"
												src="/assets/clients/recruiter-logo.svg"
												alt="Recruiter Logo"
												height={24}
												width={80}
											/>
										</div>
										<div className="flex">
											<Image
												className="mx-auto h-5 w-fit hover:opacity-80 transition-opacity dark:invert"
												src="/assets/clients/deel.svg"
												alt="Deel Logo"
												height={20}
												width={64}
											/>
										</div>
										<div className="flex">
											<Image
												className="mx-auto h-4 w-fit hover:opacity-80 transition-opacity dark:invert"
												src="/assets/clients/adecco.svg"
												alt="Adecco Logo"
												height={16}
												width={64}
											/>
										</div>
										<div className="flex">
											<Image
												className="mx-auto h-6 w-fit hover:opacity-80 transition-opacity dark:invert"
												src="/assets/clients/talentplace.svg"
												alt="Talentplace Logo"
												height={24}
												width={80}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-16 w-full lg:perspective-near lg:absolute lg:-right-6 lg:bottom-0 lg:left-3/5 lg:top-0 lg:mt-0">
							<div className="relative h-full w-full lg:max-w-2xl flex items-center justify-center">
								<div className="relative w-full">
									<DemoChatInterface />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
