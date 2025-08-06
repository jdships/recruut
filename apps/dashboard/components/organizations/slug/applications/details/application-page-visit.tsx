"use client";

import type * as React from "react";
import type { ApplicationDto } from "~/types/dtos/application-dto";

export type ApplicationPageVisitProps = {
	application: ApplicationDto;
};

export function ApplicationPageVisit({
	application: _application,
}: ApplicationPageVisitProps): React.JSX.Element {
	// For now, this is just a placeholder component
	// In the future, this could track page visits or show application activity
	return <></>;
}
