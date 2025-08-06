import { cn } from "@workspace/ui/lib/utils";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";
const BERNARD_AVATAR = "https://avatars.githubusercontent.com/u/31113941?v=4";
const THEO_AVATAR = "https://avatars.githubusercontent.com/u/68236786?v=4";
const GLODIE_AVATAR = "https://avatars.githubusercontent.com/u/99137927?v=4";

export const Table = ({ className }: { className?: string }) => {
	const customers = [
		{
			id: 1,
			date: "10/31/2025",
			status: "Approved",
			statusVariant: "success",
			name: "Bernard Ng",
			avatar: BERNARD_AVATAR,
			revenue: "$43.99",
		},
		{
			id: 2,
			date: "10/21/2025",
			status: "Pending",
			statusVariant: "warning",
			name: "Méschac Irung",
			avatar: MESCHAC_AVATAR,
			revenue: "$19.99",
		},
		{
			id: 3,
			date: "10/15/2025",
			status: "Approved",
			statusVariant: "success",
			name: "Glodie Ng",
			avatar: GLODIE_AVATAR,
			revenue: "$99.99",
		},
		{
			id: 4,
			date: "10/12/2025",
			status: "Rejected",
			statusVariant: "danger",
			name: "Theo Ng",
			avatar: THEO_AVATAR,
			revenue: "$19.99",
		},
	];

	return (
		<div
			className={cn(
				"bg-background ring-border relative mx-auto max-w-4xl rounded-2xl border border-transparent p-6 shadow-md shadow-black/10 ring-1",
				className,
			)}
		>
			<div className="mb-4">
				<div className="font-medium">Applications</div>
				<p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
					New applications by First user primary channel group (Default Channel
					Group)
				</p>
			</div>
			<table
				className="w-max table-auto border-collapse lg:w-full"
				data-rounded="medium"
			>
				<thead className="bg-muted/50">
					<tr className="*:border *:p-3 *:text-left *:text-sm *:font-medium">
						<th className="rounded-l-[--card-radius]">#</th>
						<th>Date</th>
						<th>Status</th>
						<th>Name</th>
						<th className="rounded-r-[--card-radius]">Revenue</th>
					</tr>
				</thead>
				<tbody className="text-sm">
					{customers.map((customer) => (
						<tr key={customer.id} className="*:border *:p-2">
							<td>{customer.id}</td>
							<td>{customer.date}</td>
							<td>
								<span
									className={cn(
										"rounded-full px-2 py-1 text-xs",
										customer.statusVariant === "success" &&
											"bg-green-500/15 text-green-500",
										customer.statusVariant === "danger" &&
											"bg-red-500/15 text-red-500",
										customer.statusVariant === "warning" &&
											"bg-yellow-500/15 text-yellow-500",
									)}
								>
									{customer.status}
								</span>
							</td>
							<td>
								<div className="text-title flex items-center gap-2">
									<div className="size-6 overflow-hidden rounded-full">
										<img
											src={customer.avatar}
											alt={customer.name}
											width="120"
											height="120"
											loading="lazy"
										/>
									</div>
									<span className="text-foreground">{customer.name}</span>
								</div>
							</td>
							<td>{customer.revenue}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
