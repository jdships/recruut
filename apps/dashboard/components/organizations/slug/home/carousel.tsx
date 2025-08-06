export default function Carousel() {
	return (
		<div className="text-neutral-200 leading-[1.4286] text-sm font-[intervariable,_sans-serif] flex scroll-smooth flex-col gap-4">
			<div className="flex scroll-smooth justify-between items-center gap-4">
				<h2
					className="leading-[24px] text-lg font-medium scroll-smooth"
					role="heading"
				>
					Get started with your new database
				</h2>
				<span
					className="text-[#3395ff] leading-[20px] block font-semibold scroll-smooth cursor-pointer"
					role="link"
				>
					Dismiss
				</span>
			</div>
			<div className="grid-cols-[64px_auto_64px] grid scroll-smooth">
				<div className="overflow-auto scroll-smooth col-start-1 col-span-3 row-start-1">
					<div className="flex scroll-smooth gap-5">
						<div className="w-2xs max-w-75 bg-neutral-900 grow-[1] shrink-[0] flex scroll-smooth flex-col items-center px-[22px] py-7 gap-6 border-neutral-800 border-[1px] rounded-lg">
							<span className="leading-[0] shrink-[0] block scroll-smooth align-middle size-[42px]">
								<svg
									width="42px"
									height="42px"
									viewBox="0 0 16 16"
									xmlns="http://www.w3.org/2000/svg"
									role="img"
									className="fill-neutral-200 stroke-[1px] overflow-hidden scroll-smooth align-baseline size-[42px]"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12.5303 3.37978L12.62 3.46955C13.1205 3.99306 13.4007 4.69003 13.4007 5.41589C13.4007 6.16285 13.1038 6.87941 12.5757 7.40763L11.9156 8.06706L7.93275 4.0842L8.59227 3.42407C9.12049 2.89595 9.83696 2.59915 10.5839 2.59915C11.3098 2.59915 12.0068 2.87933 12.5303 3.37978ZM12.9681 2.18322C12.2817 1.67702 11.4471 1.39915 10.5839 1.39915C9.51861 1.39915 8.49694 1.82235 7.74365 2.57563L6.23608 4.08459L11.9152 9.76373L13.4242 8.25616C14.1775 7.50287 14.6007 6.4812 14.6007 5.41589C14.6007 4.55267 14.3228 3.71809 13.8166 3.03174L15.8484 0.999895L14.9999 0.151367L12.9681 2.18322ZM6.34834 8.49998L7.84842 6.9999L6.9999 6.15137L5.49985 7.65141L4.08463 6.23604L2.57565 7.74363C1.82236 8.49692 1.39917 9.51859 1.39917 10.5839C1.39917 11.4471 1.67703 12.2817 2.18323 12.968L0.151367 14.9999L0.999895 15.8484L3.03176 13.8166C3.7181 14.3228 4.55268 14.6006 5.41591 14.6006C6.48122 14.6006 7.50299 14.1773 8.25627 13.4241L9.76382 11.9158L8.34823 10.5001L9.84842 8.9999L8.9999 8.15137L7.49975 9.65151L6.34834 8.49998ZM3.46893 12.6194C3.99251 13.1202 4.68976 13.4006 5.41591 13.4006C6.16291 13.4006 6.87932 13.1039 7.40755 12.5757L8.067 11.916L4.08419 7.93275L3.42409 8.59225C2.89597 9.12047 2.59917 9.83694 2.59917 10.5839C2.59917 11.31 2.87957 12.0073 3.3804 12.5309L3.46893 12.6194Z"
										className="fill-neutral-200 stroke-[1px] inline scroll-smooth"
									></path>
								</svg>
							</span>
							<div className="flex text-center text-balance scroll-smooth flex-col items-center gap-1">
								<div className="leading-[20px] font-medium scroll-smooth">
									Connect to your database
								</div>
								<div className="text-[#949494] leading-[18px] text-xs scroll-smooth">
									Get connection details your app needs to connect to your
									database
								</div>
							</div>
							<button
								type="button"
								className="leading-[20px] h-8 bg-transparent flex font-medium scroll-smooth justify-center items-center cursor-pointer px-3 gap-[6px] border-[#666666] border-[1px] rounded-md"
							>
								<span className="block text-nowrap whitespace-nowrap scroll-smooth cursor-pointer">
									Connect
								</span>
							</button>
						</div>
						<div className="w-2xs max-w-75 bg-neutral-900 grow-[1] shrink-[0] flex scroll-smooth flex-col items-center px-[22px] py-7 gap-6 border-neutral-800 border-[1px] rounded-lg">
							<span className="leading-[0] shrink-[0] block scroll-smooth align-middle size-[42px]">
								<svg
									width="42px"
									height="42px"
									viewBox="0 0 42 42"
									xmlns="http://www.w3.org/2000/svg"
									role="img"
									className="fill-neutral-200 stroke-[1px] overflow-hidden scroll-smooth align-baseline size-[42px]"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M19.925 11.4068V2.09961H23.075V11.4067L25.9547 8.527L28.1821 10.7544L21.5 17.4366L14.8178 10.7544L17.0452 8.527L19.925 11.4068ZM29.3604 11.4707L30.9149 11.724C33.2792 12.1093 35.3405 12.6489 36.853 13.3315C37.6048 13.6707 38.3052 14.0822 38.8408 14.5935C39.378 15.1064 39.875 15.8481 39.875 16.7996V35.4527C39.875 36.9262 38.7643 37.9198 37.8073 38.5161C36.7648 39.1657 35.3613 39.6942 33.768 40.1159C30.5583 40.9655 26.2167 41.4746 21.5 41.4746C16.7833 41.4746 12.4417 40.9655 9.23198 40.1159C7.6387 39.6942 6.23524 39.1657 5.19275 38.5161C4.2357 37.9198 3.125 36.9262 3.125 35.4527V16.7996C3.125 15.8684 3.60163 15.1373 4.12445 14.6271C4.64418 14.1198 5.32328 13.7118 6.05007 13.3757C7.51177 12.6997 9.50223 12.163 11.7854 11.7739L13.3381 11.5094L13.8672 14.6146L12.3146 14.8792C10.161 15.2461 8.47641 15.7241 7.37232 16.2348C6.90368 16.4515 6.5981 16.6477 6.41474 16.8005C6.50199 16.8727 6.63151 16.9662 6.82163 17.0786C7.48478 17.4705 8.54921 17.8781 10.0026 18.2415C12.8851 18.9621 16.9508 19.4246 21.5 19.4246C26.0492 19.4246 30.1149 18.9621 32.9974 18.2415C34.4508 17.8781 35.5152 17.4705 36.1784 17.0786C36.3685 16.9662 36.498 16.8727 36.5853 16.8005C36.3909 16.6385 36.0629 16.4307 35.5575 16.2027C34.4005 15.6806 32.6426 15.1971 30.4083 14.833L28.8538 14.5797L29.3604 11.4707ZM36.725 20.3246C35.8656 20.7003 34.8592 21.023 33.7614 21.2974C30.5635 22.0969 26.2292 22.5746 21.5 22.5746C16.7708 22.5746 12.4365 22.0969 9.23861 21.2974C8.14083 21.023 7.13444 20.7003 6.275 20.3246V25.1996C6.275 25.449 6.40615 25.8809 7.0679 26.465C7.72629 27.0461 8.76814 27.6418 10.188 28.1743C13.0159 29.2347 17.0205 29.9246 21.5 29.9246C25.9795 29.9246 29.9841 29.2347 32.812 28.1743C34.2319 27.6418 35.2737 27.0461 35.9321 26.465C36.5938 25.8809 36.725 25.449 36.725 25.1996V20.3246ZM36.725 29.7762C35.9 30.2886 34.9492 30.737 33.918 31.1237C30.6559 32.347 26.2605 33.0746 21.5 33.0746C16.7395 33.0746 12.3441 32.347 9.08198 31.1237C8.05083 30.737 7.09999 30.2886 6.275 29.7762V35.3635C6.31616 35.4239 6.45395 35.5905 6.8585 35.8426C7.52225 36.2561 8.5863 36.6865 10.038 37.0708C12.9183 37.8332 16.9767 38.3246 21.5 38.3246C26.0233 38.3246 30.0817 37.8332 32.962 37.0708C34.4137 36.6865 35.4777 36.2561 36.1415 35.8426C36.5461 35.5905 36.6838 35.4239 36.725 35.3635V29.7762Z"
										className="fill-neutral-200 stroke-[1px] inline scroll-smooth"
									></path>
								</svg>
							</span>
							<div className="flex text-center text-balance scroll-smooth flex-col items-center gap-1">
								<div className="leading-[20px] font-medium scroll-smooth">
									Import your data
								</div>
								<div className="text-[#949494] leading-[18px] text-xs scroll-smooth">
									Automatically import your data directly into your Neon
									database
								</div>
							</div>
							<button
								type="button"
								className="leading-[20px] h-8 bg-transparent flex font-medium scroll-smooth justify-center items-center cursor-pointer px-3 gap-[6px] border-[#666666] border-[1px] rounded-md"
							>
								<span className="block text-nowrap whitespace-nowrap scroll-smooth cursor-pointer">
									Import database
								</span>
							</button>
						</div>
						<div className="w-2xs max-w-75 bg-neutral-900 grow-[1] shrink-[0] flex scroll-smooth flex-col items-center px-[22px] py-7 gap-6 border-neutral-800 border-[1px] rounded-lg">
							<span className="leading-[0] shrink-[0] block scroll-smooth align-middle size-[42px]">
								<svg
									width="42px"
									height="42px"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									role="img"
									className="fill-neutral-200 stroke-[1px] overflow-hidden scroll-smooth align-baseline size-[42px]"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M9.5 2.5C9.5 2.22386 9.72386 2 10 2C10.2761 2 10.5 2.22386 10.5 2.5C10.5 2.77614 10.2761 3 10 3C9.72386 3 9.5 2.77614 9.5 2.5ZM10.75 4.35462C11.483 4.05793 12 3.33934 12 2.5C12 1.39543 11.1046 0.5 10 0.5C8.89543 0.5 8 1.39543 8 2.5C8 3.33934 8.51704 4.05793 9.25 4.35462V19.5H10.75V4.35462ZM4.5 4.375C4.5 4.09886 4.72386 3.875 5 3.875C5.27614 3.875 5.5 4.09886 5.5 4.375C5.5 4.65114 5.27614 4.875 5 4.875C4.72386 4.875 4.5 4.65114 4.5 4.375ZM5.75 6.22962C6.48296 5.93293 7 5.21434 7 4.375C7 3.27043 6.10457 2.375 5 2.375C3.89543 2.375 3 3.27043 3 4.375C3 5.21434 3.51704 5.93293 4.25 6.22962V8.43566L6.75 10.9357V19.5H8.25V10.3143L5.75 7.81434V6.22962ZM3.875 14.6893V13.1046C4.60796 12.8079 5.125 12.0893 5.125 11.25C5.125 10.1454 4.22957 9.25 3.125 9.25C2.02043 9.25 1.125 10.1454 1.125 11.25C1.125 12.0893 1.64204 12.8079 2.375 13.1046V15.3107L4.25 17.1857V19.5H5.75V16.5643L3.875 14.6893ZM3.625 11.25C3.625 11.5261 3.40114 11.75 3.125 11.75C2.84886 11.75 2.625 11.5261 2.625 11.25C2.625 10.9739 2.84886 10.75 3.125 10.75C3.40114 10.75 3.625 10.9739 3.625 11.25ZM17.625 13.1046V15.3107L15.75 17.1857V19.5H14.25V16.5643L16.125 14.6893V13.1046C15.392 12.8079 14.875 12.0893 14.875 11.25C14.875 10.1454 15.7704 9.25 16.875 9.25C17.9796 9.25 18.875 10.1454 18.875 11.25C18.875 12.0893 18.358 12.8079 17.625 13.1046ZM16.875 11.75C17.1511 11.75 17.375 11.5261 17.375 11.25C17.375 10.9739 17.1511 10.75 16.875 10.75C16.5989 10.75 16.375 10.9739 16.375 11.25C16.375 11.5261 16.5989 11.75 16.875 11.75ZM15.75 8.43566V6.22962C16.483 5.93293 17 5.21434 17 4.375C17 3.27043 16.1046 2.375 15 2.375C13.8954 2.375 13 3.27043 13 4.375C13 5.21434 13.517 5.93293 14.25 6.22962V7.81434L11.75 10.3143V19.5H13.25V10.9357L15.75 8.43566ZM15.5 4.375C15.5 4.65114 15.2761 4.875 15 4.875C14.7239 4.875 14.5 4.65114 14.5 4.375C14.5 4.09886 14.7239 3.875 15 3.875C15.2761 3.875 15.5 4.09886 15.5 4.375Z"
										className="fill-neutral-200 stroke-[1px] inline scroll-smooth"
									></path>
								</svg>
							</span>
							<div className="flex text-center text-balance scroll-smooth flex-col items-center gap-1">
								<div className="leading-[20px] font-medium scroll-smooth">
									Integrate Neon with your AI tools
								</div>
								<div className="text-[#949494] leading-[18px] text-xs scroll-smooth">
									Connect to MCP clients like Cursor, Claude Desktop, Cline,
									Zed, and Windsurf.
								</div>
							</div>
							<a
								className="leading-[20px] h-8 flex font-medium scroll-smooth justify-center items-center cursor-pointer px-3 gap-[6px] border-[#666666] border-[1px] rounded-md"
								href="https://neon.com/docs/ai/connect-mcp-clients-to-neon"
								rel="noreferrer"
							>
								<span className="block text-nowrap whitespace-nowrap scroll-smooth cursor-pointer">
									Install MCP Server
								</span>
							</a>
						</div>
						<div className="w-2xs max-w-75 bg-neutral-900 grow-[1] shrink-[0] flex scroll-smooth flex-col items-center px-[22px] py-7 gap-6 border-neutral-800 border-[1px] rounded-lg">
							<span className="leading-[0] shrink-[0] block scroll-smooth align-middle size-[42px]">
								<svg
									id="Layer_1"
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									viewBox="0 0 20 20"
									width="42px"
									height="42px"
									role="img"
									className="fill-neutral-200 stroke-[1px] overflow-hidden scroll-smooth align-baseline size-[42px]"
								>
									<path
										className="fill-neutral-200 stroke-[1px] inline scroll-smooth"
										d="M20,0H2.1v1.4h16.5v16.7H20V0z M0,2.5h17.1V20H0V2.5z M1.4,3.9v14.7h14.3V3.9H1.4z M3.6,6.8h10v1.4h-10V6.8z  M13.6,10.5h-10v1.4h10V10.5z M3.6,14.3h4.3v1.4H3.6V14.3z"
									></path>
								</svg>
							</span>
							<div className="flex text-center text-balance scroll-smooth flex-col items-center gap-1">
								<div className="leading-[20px] font-medium scroll-smooth">
									Get sample data
								</div>
								<div className="text-[#949494] leading-[18px] text-xs scroll-smooth">
									Easily test out your Neon database with Neon prepared datasets
								</div>
							</div>
							<a
								className="leading-[20px] h-8 flex font-medium scroll-smooth justify-center items-center cursor-pointer px-3 gap-[6px] border-[#666666] border-[1px] rounded-md"
								href="https://neon.com/docs/import/import-sample-data"
								rel="noreferrer"
							>
								<span className="block text-nowrap whitespace-nowrap scroll-smooth cursor-pointer">
									Get data
								</span>
							</a>
						</div>
						<div className="w-2xs max-w-75 bg-neutral-900 grow-[1] shrink-[0] flex scroll-smooth flex-col items-center px-[22px] py-7 gap-6 border-neutral-800 border-[1px] rounded-lg">
							<span className="leading-[0] shrink-[0] block scroll-smooth align-middle size-[42px]">
								<svg
									id="Layer_1"
									xmlns="http://www.w3.org/2000/svg"
									x="0px"
									y="0px"
									viewBox="0 0 20 20"
									width="42px"
									height="42px"
									role="img"
									className="fill-neutral-200 stroke-[1px] scroll-smooth align-baseline size-[42px]"
								>
									<path
										fillRule="evenodd"
										d="M1.8,1.8C2,1.5,2.3,1.4,2.7,1.4h2.6V6H1.4V2.7C1.4,2.3,1.5,2,1.8,1.8z M1.4,7.4V12h3.9 V7.4H1.4z M1.4,13.4v4c0,0.3,0.1,0.7,0.4,0.9c0.2,0.2,0.6,0.4,0.9,0.4h2.6v-5.2L1.4,13.4L1.4,13.4z M6.7,18.6h10.6 c0.3,0,0.7-0.1,0.9-0.4c0.2-0.2,0.4-0.6,0.4-0.9v-4H6.7V18.6z M18.6,12V7.4H6.7V12H18.6z M18.6,6V2.7c0-0.3-0.1-0.7-0.4-0.9 c-0.2-0.2-0.6-0.4-0.9-0.4H6.7V6H18.6z M2.7,0C2,0,1.3,0.3,0.8,0.8S0,2,0,2.7v14.6c0,0.7,0.3,1.4,0.8,1.9S2,20,2.7,20h14.6 c0.7,0,1.4-0.3,1.9-0.8S20,18,20,17.3V2.7c0-0.7-0.3-1.4-0.8-1.9S18,0,17.3,0H2.7z"
										className="fill-neutral-200 stroke-[1px] inline scroll-smooth"
									></path>
								</svg>
							</span>
							<div className="flex text-center text-balance scroll-smooth flex-col items-center gap-1">
								<div className="leading-[20px] font-medium scroll-smooth">
									View database contents
								</div>
								<div className="text-[#949494] leading-[18px] text-xs scroll-smooth">
									Manage your database and view table contents with the Tables
									page
								</div>
							</div>
							<a
								className="leading-[20px] h-8 flex font-medium scroll-smooth justify-center items-center cursor-pointer px-3 gap-[6px] border-[#666666] border-[1px] rounded-md"
								href="/app/projects/odd-water-39899956/branches/br-billowing-dream-a2a81lt3/tables"
							>
								<span className="block text-nowrap whitespace-nowrap scroll-smooth cursor-pointer">
									Go to Tables page
								</span>
							</a>
						</div>
					</div>
				</div>
				<button
					type="button"
					className="bg-transparent bg-[linear-gradient(to_left,_rgba(25,_25,_25,_0),_rgba(25,_25,_25,_0.8))] flex scroll-smooth items-center cursor-pointer col-start-1 row-start-1 p-[10px]"
					title="Scroll left"
				>
					<span className="leading-[0] shrink-[0] block scroll-smooth align-middle cursor-pointer size-6">
						<svg
							width="24px"
							height="24px"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							role="img"
							className="fill-neutral-200 stroke-[1px] overflow-hidden scroll-smooth align-baseline cursor-pointer size-6"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M14.773 2L6.76776 10.0052L14.773 18.0104L13.0052 19.7782L3.23222 10.0052L13.0052 0.232231L14.773 2Z"
								className="fill-neutral-200 stroke-[1px] inline scroll-smooth cursor-pointer"
							></path>
						</svg>
					</span>
				</button>
			</div>
		</div>
	);
}
