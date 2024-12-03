import { z } from "zod";

import {
	schoolListSuccessResponseSchema,
	createSchoolSuccessResponseSchema,
	schoolSchema,
	schoolDetailsSuccessResponseSchema,
	updateSchoolSuccessResponseSchema,
	periodSchema,
} from "./schemas";

import { CreateSchoolFields } from "@features/school-create";

import { ValidationError } from "@api/types";

export interface GetSchoolParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface GetSchoolDetailsParams {
	signal?: AbortSignal;
	payload: GetSchoolDetailsPayload;
}

export interface GetSchoolDetailsPayload {
	id: string;
}

export interface SchoolsQueryType
	extends SchoolsListQueryType,
		SchoolDetailsQueryType {}

export interface SchoolDetailsQueryType {
	"school-details": SchoolDetailsResponse;
}

export interface SchoolsPayload {
	"school-details": GetSchoolDetailsPayload;
	schools: undefined;
}

export interface SchoolsListQueryType {
	schools: SchoolListResponse;
}

export interface UseSchoolsQueryParams<T extends keyof SchoolsQueryType> {
	isEnabled: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	searchParams?: Record<string, unknown>;
	payload?: SchoolsPayload[T];
}

export type SchoolListResponse = z.infer<
	typeof schoolListSuccessResponseSchema
>;

export type School = z.infer<typeof schoolSchema>;

export type Period = z.infer<typeof periodSchema>;

export interface DeleteSchool {
	schoolId: string;
}

export interface CreateSchool {
	school: CreateSchoolFields;
}

export type CreateSchoolValidationError = ValidationError<
	Record<keyof CreateSchoolFields, string[]>
>;

export type CreateSchoolSuccessResponse = z.infer<
	typeof createSchoolSuccessResponseSchema
>;

export type SchoolDetailsResponse = z.infer<
	typeof schoolDetailsSuccessResponseSchema
>;

export interface UpdateSchool {
	schoolId: string;
	school: CreateSchoolFields;
}

export type UpdateSchoolValidationError = ValidationError<
	Record<keyof CreateSchoolFields, string[]>
>;

export type UpdateSchoolSuccessResponse = z.infer<
	typeof updateSchoolSuccessResponseSchema
>;
