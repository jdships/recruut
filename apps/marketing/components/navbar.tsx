"use client";
import { Button } from "@workspace/ui/components/button";
import { GithubButton } from "@workspace/ui/components/github-button";
import { Logo } from "@workspace/ui/components/logo";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { env } from "~/env";
import { useGithubStars } from "~/hooks/use-github-stars";

const menuItems = [
	{ name: "Product", href: "#product" },
	{ name: "FAQ", href: "#faq" },
];

export const Navbar = () => {
	const [menuState, setMenuState] = React.useState(false);
	const { stars } = useGithubStars("https://github.com/jdships/recruut", {
		fallbackStars: 0,
	});
	const [isScrolled, setIsScrolled] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={cn(
					"fixed z-20 w-full transition-all duration-300",
					isScrolled && "bg-card/75 border-b backdrop-blur-lg",
				)}
			>
				<div className="mx-auto max-w-6xl px-6 lg:px-12">
					<div className="relative flex flex-wrap items-center justify-between gap-4 py-4 lg:gap-0 lg:py-3">
						<div className="flex w-full justify-between gap-6 lg:w-auto">
							<Link
								href="/"
								aria-label="home"
								className="flex items-center space-x-2"
							>
								<Logo />
							</Link>

							<button
								type="button"
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState === true ? "Close Menu" : "Open Menu"}
								className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
							>
								<Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
								<X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
							</button>
							<div className="m-auto hidden size-fit lg:block">
								<ul className="flex gap-1">
									{menuItems.map((item) => (
										<li key={item.name}>
											<Link href={item.href}>
												<Button
													variant="ghost"
													size="sm"
													className="text-muted-foreground group-hover:text-foreground font-medium"
												>
													<span>{item.name}</span>
												</Button>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
							<div className="lg:hidden">
								<ul className="space-y-6 text-base">
									{menuItems.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-muted-foreground hover:text-accent-foreground block duration-150 text-sm"
											>
												<span>{item.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="flex w-full flex-col space-y-2 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit">
								<GithubButton
									targetStars={stars}
									label="Star"
									size="sm"
									repoUrl="https://github.com/jdships/recruut"
									variant="ghost"
									showZeroStars={true}
								/>

								<Link
									href={`${env.NEXT_PUBLIC_AGENT_URL}/40fc100b-82d3-4371-b08d-002776baebf6`}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full md:w-auto"
								>
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="w-full group"
									>
										<span>Try Demo</span>
										<ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
