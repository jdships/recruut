import type * as React from "react";
import FAQ from "~/components/sections/faq";
import Hero from "~/components/sections/hero";
import Product from "~/components/sections/product";
export default function IndexPage(): React.JSX.Element {
	return (
		<>
			<Hero />
			<Product />
			<FAQ />
		</>
	);
}
