import {
	createSearchParamsCache,
	createSerializer,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
} from "nuqs/server";

export const applicationsSearchParams = {
	pageIndex: parseAsInteger.withDefault(0),
	pageSize: parseAsInteger.withDefault(50),
	searchQuery: parseAsString.withDefault(""),
	opportunity: parseAsString.withDefault(""),
	flags: parseAsArrayOf(parseAsString).withDefault([]),
};

export const applicationsSearchParamsCache = createSearchParamsCache(
	applicationsSearchParams,
);
export const serializer = createSerializer(applicationsSearchParams);
