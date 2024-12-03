import { useQuery } from "@tanstack/react-query";

import { getSchools, getSchoolDetails } from "./services";

import { exhaustiveCheck } from "@utils/exhaustive-check";

import {
	UseSchoolsQueryParams,
	SchoolsQueryType,
	GetSchoolDetailsPayload,
} from "./types";

export function useSchoolsQuery<T extends keyof SchoolsQueryType>({
	queryType,
	isEnabled,
	queryKey,
	searchParams,
	payload,
}: UseSchoolsQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		queryKey,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "schools":
					return getSchools({ signal, searchParams }) as Promise<
						SchoolsQueryType[T]
					>;
				case "school-details":
					return getSchoolDetails({
						signal,
						payload: payload as GetSchoolDetailsPayload,
					}) as Promise<SchoolsQueryType[T]>;
			}

			exhaustiveCheck(queryType);
		},
	});

	return data;
}
