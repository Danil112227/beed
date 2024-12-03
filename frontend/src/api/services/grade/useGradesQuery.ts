import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getGrades, getGradeDetails } from "./services";

import {
	UseGradesQueryParams,
	GradesQueryType,
	GetGradeDetailsPayload,
} from "./types";

export function useGradesQuery<T extends keyof GradesQueryType>({
	queryType,
	isEnabled,
	queryKey,
	searchParams,
	isPaginationEnabled,
	payload,
}: UseGradesQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		queryKey,
		placeholderData: isPaginationEnabled ? keepPreviousData : undefined,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "grades":
					return getGrades({ signal, searchParams }) as Promise<
						GradesQueryType[T]
					>;
				case "grade-details":
					return getGradeDetails({
						signal,
						payload: payload as GetGradeDetailsPayload,
					}) as Promise<GradesQueryType[T]>;
			}
		},
	});

	return data;
}
