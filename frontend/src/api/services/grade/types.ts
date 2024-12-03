import { z } from "zod";

import { ValidationError } from "@api/types";

import {
	gradesListSuccessResponseSchema,
	gradeSchema,
	createGradeSuccessResponseSchema,
	updateGradeSuccessResponseSchema,
	gradeDetailsSuccessResponseSchema,
} from "./schemas";

import { CreateClassFields } from "@features/class-create";
import { AddGradeStudentsFields } from "@features/dialog";

export interface GetGradesParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface GetGradeDetailsParams {
	signal?: AbortSignal;
	payload: GetGradeDetailsPayload;
}

export interface GetGradeDetailsPayload {
	id: string;
}

export interface GradesQueryType
	extends GradeListQueryType,
		GradeDetailsQueryType {}

export interface GradeListQueryType {
	grades: GradesListResponse;
}

export interface CreateGrade {
	grade: CreateClassFields;
}

export type CreateGradeValidationError = ValidationError<
	Record<keyof Omit<Grade, "id">, string[]>
>;

export type CreateGradeSuccessResponse = z.infer<
	typeof createGradeSuccessResponseSchema
>;

export interface UpdateGrade {
	grade: CreateClassFields;
	gradeId: string;
}

export type UpdateGradeValidationError = ValidationError<
	Record<keyof Omit<Grade, "id">, string[]>
>;

export type UpdateGradeSuccessResponse = z.infer<
	typeof updateGradeSuccessResponseSchema
>;

export interface AddGradeStudent {
	students: AddGradeStudentsFields;
	gradeId: string;
}

export type AddGradeStudentValidationError = ValidationError<
	Record<keyof Pick<Grade, "users">, string[]>
>;

export type AddGradeStudentSuccessResponse = z.infer<
	typeof updateGradeSuccessResponseSchema
>;

export interface RemoveGradeStudent {
	students: AddGradeStudentsFields;
	gradeId: string;
}

export type RemoveGradeStudentValidationError = ValidationError<
	Record<keyof Pick<Grade, "users">, string[]>
>;

export type RemoveGradeStudentSuccessResponse = z.infer<
	typeof updateGradeSuccessResponseSchema
>;

export interface GradeDetailsQueryType {
	"grade-details": GradeDetailsResponse;
}

export interface GradesPayload {
	"grade-details": GetGradeDetailsPayload;
	grades: undefined;
}

export interface UseGradesQueryParams<T extends keyof GradesQueryType> {
	isEnabled: boolean;
	isPaginationEnabled?: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	searchParams?: Record<string, unknown>;
	payload?: GradesPayload[T];
}

export type GradesListResponse = z.infer<
	typeof gradesListSuccessResponseSchema
>;

export type GradeDetailsResponse = z.infer<
	typeof gradeDetailsSuccessResponseSchema
>;

export type Grade = z.infer<typeof gradeSchema>;

export interface DeleteGrade {
	gradeId: string;
}
