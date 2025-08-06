"use client";

import dynamic from "next/dynamic";

const CrispWithNoSSR = dynamic(() => import("./crisp"), { ssr: false });

export default function CrispWrapper() {
	return <CrispWithNoSSR />;
}
