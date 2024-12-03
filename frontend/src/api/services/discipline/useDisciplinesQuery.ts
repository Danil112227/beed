import { useQuery } from "@tanstack/react-query";

import { getDisciplines } from "./services";

import { UseDisciplinesQueryParams, DeisciplinesQueryType } from "./types";

export function useDisciplinesQuery<T extends keyof DeisciplinesQueryType>({
	queryType,
	isEnabled,
	queryKey,
	searchParams,
}: UseDisciplinesQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		queryKey,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "disciplines":
					return getDisciplines({ signal, searchParams }) as Promise<
						DeisciplinesQueryType[T]
					>;
			}
		},
	});

	return data;
}
