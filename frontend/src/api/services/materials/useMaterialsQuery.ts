import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getMaterials, getMaterialDetails } from "./services";

import { exhaustiveCheck } from "@utils/exhaustive-check";

import {
	UseMaterialsQueryParams,
	MaterialsQueryType,
	GetMaterialDetailsPayload,
} from "./types";

export function useMaterialsQuery<T extends keyof MaterialsQueryType>({
	queryType,
	isEnabled,
	isPaginationEnabled,
	queryKey,
	searchParams,
	payload,
}: UseMaterialsQueryParams<T>) {
	const { data } = useQuery({
		enabled: isEnabled,
		placeholderData: isPaginationEnabled ? keepPreviousData : undefined,
		queryKey,
		queryFn: ({ signal }) => {
			switch (queryType) {
				case "materials":
					return getMaterials({ signal, searchParams }) as Promise<
						MaterialsQueryType[T]
					>;
				case "lesson-materials":
					return getMaterials({
						signal,
						searchParams,
						isLesson: true,
					}) as Promise<MaterialsQueryType[T]>;
				case "material-details":
					return getMaterialDetails({
						signal,
						payload: payload as GetMaterialDetailsPayload,
					}) as Promise<MaterialsQueryType[T]>;
				case "lesson-material-details":
					return getMaterialDetails({
						signal,
						isLesson: true,
						payload: payload as GetMaterialDetailsPayload,
					}) as Promise<MaterialsQueryType[T]>;
			}

			exhaustiveCheck(queryType);
		},
	});

	return data;
}
