import { useQuery, keepPreviousData } from "@tanstack/react-query";

import {
	getLessons,
	getLessonDetails,
	getPeriods,
	getMasterLessons,
	getMasterLessonDetails,
} from "./services";

import { exhaustiveCheck } from "@utils/exhaustive-check";

import {
	LessonsQueryType,
	UseLessonQueryParams,
	GetLessonDetailsPayload,
	GetMasterLessonDetailsPayload,
} from "./types";

export function useLessonQuery<T extends keyof LessonsQueryType>({
	queryType,
	isEnabled,
	queryKey,
	searchParams,
	payload,
	isKeepPreviousData,
}: UseLessonQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		queryKey,
		placeholderData: isKeepPreviousData ? keepPreviousData : undefined,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "lessons":
					return getLessons({ signal, searchParams }) as Promise<
						LessonsQueryType[T]
					>;
				case "lesson-details":
					return getLessonDetails({
						signal,
						payload: payload as GetLessonDetailsPayload,
					}) as Promise<LessonsQueryType[T]>;
				case "periods":
					return getPeriods({ signal, searchParams }) as Promise<
						LessonsQueryType[T]
					>;
				case "master-lessons":
					return getMasterLessons({ signal, searchParams }) as Promise<
						LessonsQueryType[T]
					>;
				case "master-lesson-details":
					return getMasterLessonDetails({
						signal,
						payload: payload as GetMasterLessonDetailsPayload,
					}) as Promise<LessonsQueryType[T]>;
			}

			exhaustiveCheck(queryType);
		},
	});

	return data;
}
