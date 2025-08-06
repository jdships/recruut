import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";

export default function Testimonials() {
	const testimonials = [
		{
			name: "Sofia Muller",
			role: "HR Director",
			avatar: "/assets/people/sofia_muller.png",
			content:
				"Recruut has completely transformed our hiring process. The AI-powered screening saves us hours and helps us identify the best candidates faster than ever.",
		},
		{
			name: "Gabriel Fischer",
			role: "Talent Acquisition Lead",
			avatar: "/assets/people/gabriel_fischer.png",
			content:
				"The automated candidate evaluation and scoring system is incredibly accurate. We've reduced our time-to-hire by 60% while improving candidate quality.",
		},
		{
			name: "Victoria Ballard",
			role: "Recruiting Manager",
			avatar: "/assets/people/victoria_ballard.png",
			content:
				"What used to take weeks now takes days. Recruut's intelligent matching and streamlined workflow has revolutionized how we approach talent acquisition.",
		},
	];

	return (
		<section>
			<div className="py-12">
				<div className="@container mx-auto w-full max-w-6xl px-6 lg:px-12">
					<div className="mb-12">
						<span className="text-muted-foreground">Testimonials</span>
						<h2 className="text-foreground mt-4 text-4xl font-semibold">
							What Our Clients Say
						</h2>
						<p className="text-muted-foreground my-4 text-balance text-lg">
							Discover why our clients love working with us. Read their
							testimonials about our dedication to excellence, innovative
							solutions, and exceptional customer service.
						</p>
					</div>
					<div className="@lg:grid-cols-2 @3xl:grid-cols-3 grid gap-6">
						{testimonials.map((testimonial) => (
							<div key={testimonial.name}>
								<div className="bg-background ring-foreground/10 rounded-3xl rounded-bl border border-transparent px-4 py-3 ring-1">
									<p className="text-foreground">{testimonial.content}</p>
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
										<AvatarImage
											src={testimonial.avatar}
											alt={testimonial.name}
										/>
										<AvatarFallback>
											{testimonial.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="text-foreground text-sm font-medium">
										{testimonial.name}
									</div>
									<span
										aria-hidden
										className="bg-foreground/25 size-1 rounded-full"
									></span>
									<span className="text-muted-foreground text-sm">
										{testimonial.role}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
