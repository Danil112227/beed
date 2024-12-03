import { useQuery } from "@tanstack/react-query";

import { getSelfUserData } from "./services";

import { UseAuthQueryParams, AuthQueryType } from "./types";

export function useAuthQuery<T extends keyof AuthQueryType>({
	queryType,
	queryKey,
	isEnabled,
	retry,
}: UseAuthQueryParams<T>) {
	const { data, isLoading } = useQuery({
		enabled: isEnabled,
		queryKey,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "self-user-data":
					return getSelfUserData({
						signal,
					}) as Promise<AuthQueryType[T]>;
			}
		},
		retry,
	});

	return { data, isLoading };
}
