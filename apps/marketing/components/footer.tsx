import { ThemeSwitcher } from "@workspace/ui/components/theme-switcher";
import Link from "next/link";

const links = [
	{
		title: "Terms of Service",
		href: "/terms-of-use",
	},
	{
		title: "Privacy Policy",
		href: "/privacy-policy",
	},
	{
		title: "Contact Us",
		href: "/contact",
	},
];

export function Footer() {
	return (
		<footer className="border-t bg-card py-4 mt-12">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				<div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-center md:gap-8">
					<div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3">
						<span className="text-muted-foreground block text-center text-xs">
							© {new Date().getFullYear()} Recruut. All rights reserved
						</span>
					</div>

					<div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-x-6 md:gap-y-0">
						<div className="flex flex-row items-center justify-center gap-x-6">
							{links.map((link) => (
								<Link
									key={link.title}
									href={link.href}
									className="text-muted-foreground hover:text-primary block duration-150 text-xs"
								>
									<span>{link.title}</span>
								</Link>
							))}
						</div>
						<ThemeSwitcher />
					</div>
				</div>
			</div>
		</footer>
	);
}
