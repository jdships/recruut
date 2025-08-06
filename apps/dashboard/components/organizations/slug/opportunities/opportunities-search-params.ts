import {
	createSearchParamsCache,
	createSerializer,
	parseAsInteger,
	parseAsString,
} from "nuqs/server";

export const opportunitiesSearchParams = {
	pageIndex: parseAsInteger.withDefault(0),
	pageSize: parseAsInteger.withDefault(50),
	searchQuery: parseAsString.withDefault(""),
};

export const opportunitiesSearchParamsCache = createSearchParamsCache(
	opportunitiesSearchParams,
);
export const serializer = createSerializer(opportunitiesSearchParams);
