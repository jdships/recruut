import { subDays } from "date-fns";
import {
	createSearchParamsCache,
	createSerializer,
	parseAsIsoDateTime,
} from "nuqs/server";

function buildParams() {
	const now = new Date();
	return {
		from: parseAsIsoDateTime.withDefault(subDays(now, 30)),
		to: parseAsIsoDateTime.withDefault(now),
	};
}
export const searchParams = buildParams();

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serializer = createSerializer(searchParams);
