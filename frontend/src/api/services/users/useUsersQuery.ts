import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getUsers, getUserDetails } from "./services";

import { exhaustiveCheck } from "@utils/exhaustive-check";

import {
	UseUsersQueryParams,
	UsersQueryType,
	GetUserDetailsPayload,
} from "./types";

export function useUsersQuery<T extends keyof UsersQueryType>({
	queryType,
	isEnabled,
	isPaginationEnabled,
	queryKey,
	searchParams,
	payload,
}: UseUsersQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		queryKey,
		placeholderData: isPaginationEnabled ? keepPreviousData : undefined,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "users-extended":
					return getUsers({
						signal,
						isExtendedVersion: true,
						searchParams,
					}) as Promise<UsersQueryType[T]>;
				case "users-short":
					return getUsers({
						signal,
						isExtendedVersion: false,
						searchParams,
					}) as Promise<UsersQueryType[T]>;
				case "users-details-extended":
					return getUserDetails({
						signal,
						isExtendedVersion: true,
						payload: payload as GetUserDetailsPayload,
					}) as Promise<UsersQueryType[T]>;
				case "users-details-short":
					return getUserDetails({
						signal,
						isExtendedVersion: false,
						payload: payload as GetUserDetailsPayload,
					}) as Promise<UsersQueryType[T]>;
			}

			exhaustiveCheck(queryType);
		},
	});

	return data;
}
