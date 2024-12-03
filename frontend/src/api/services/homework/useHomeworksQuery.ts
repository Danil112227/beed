import { useQuery } from "@tanstack/react-query";

import {
	getHomeworks,
	getHomeworkDetails,
	getHomeworkStudentAnswers,
	getHomeworkTeacherAnswers,
} from "./services";

import {
	UseHomeworksQueryParams,
	HomeworksQueryType,
	GetHomeworklDetailsPayload,
} from "./types";

import { exhaustiveCheck } from "@utils/exhaustive-check";

export function useHomeworksQuery<T extends keyof HomeworksQueryType>({
	queryType,
	isEnabled,
	queryKey,
	searchParams,
	payload,
}: UseHomeworksQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		queryKey,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "homework":
					return getHomeworks({ signal, searchParams }) as Promise<
						HomeworksQueryType[T]
					>;
				case "homework-details":
					return getHomeworkDetails({
						signal,
						payload: payload as GetHomeworklDetailsPayload,
						searchParams,
					}) as Promise<HomeworksQueryType[T]>;
				case "homework-student-answers":
					return getHomeworkStudentAnswers({ signal, searchParams }) as Promise<
						HomeworksQueryType[T]
					>;
				case "homework-teacher-answers":
					return getHomeworkTeacherAnswers({ signal, searchParams }) as Promise<
						HomeworksQueryType[T]
					>;
			}

			exhaustiveCheck(queryType);
		},
	});

	return data;
}
