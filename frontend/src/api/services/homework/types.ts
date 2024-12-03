import { z } from "zod";

import {
	homeworkListSuccessResponseSchema,
	homeworkSchema,
	homeworkDetailsSuccessResponseSchema,
	createHomeworkSuccessResponseSchema,
	updateHomeworkSuccessResponseSchema,
	createHomeworkStudentAnswerSuccessResponseSchema,
	homeworkStudentAnswerListSuccessResponseSchema,
	updateHomeworkStudentAnswerSuccessResponseSchema,
	homeworkTeacherAnswerListSuccessResponseSchema,
	updateHomeworkTeacherAnswerSuccessResponseSchema,
	homeworkStudentAnswerSchema,
	homeworkTeacherAnswerSchema,
	createHomeworkTeacherAnswerSuccessResponseSchema,
} from "./schemas";

import {
	CreateHomeworkFields,
	CreateHomeworkStudentAnswerFields,
	CreateHomeworkTeacherAnswerFields,
} from "@features/user-details";

import { ValidationError } from "@api/types";

export interface GetHomeworksParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export type HomeworkStudentAnswer = z.infer<typeof homeworkStudentAnswerSchema>;
export type HomeworkTeacherAnswer = z.infer<typeof homeworkTeacherAnswerSchema>;

export interface GetHomeworkStudentAnswersParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface GetHomeworkTeacherAnswersParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface DeleteHomework {
	homeworkId: string;
}

export interface GetHomeworklDetailsPayload {
	id: string;
}

export interface GetMaterialDetailsParams {
	signal?: AbortSignal;
	payload: GetHomeworklDetailsPayload;
	searchParams?: Record<string, unknown>;
}

export interface HomeworksQueryType
	extends HomeworksListQueryType,
		MaterialDetailsQueryType {}

export interface MaterialDetailsQueryType {
	"homework-details": HomeworkDetailsResponse;
}

interface HomeworksListQueryType {
	homework: HomeworkListResponse;
	"homework-student-answers": HomeworkStudentAnswerListResponse;
	"homework-teacher-answers": HomeworkTeacherAnswerListResponse;
}

export interface GetHomeworkDetailsPayload {
	id: string;
}

export interface HomeworksPayload {
	"homework-details": GetHomeworkDetailsPayload;
	homework: undefined;
	"homework-student-answers": undefined;
	"homework-teacher-answers": undefined;
}

export interface UseHomeworksQueryParams<T extends keyof HomeworksQueryType> {
	isEnabled: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	searchParams?: Record<string, unknown>;
	payload?: HomeworksPayload[T];
}

export type HomeworkStudentAnswerListResponse = z.infer<
	typeof homeworkStudentAnswerListSuccessResponseSchema
>;

export type HomeworkTeacherAnswerListResponse = z.infer<
	typeof homeworkTeacherAnswerListSuccessResponseSchema
>;

export type HomeworkListResponse = z.infer<
	typeof homeworkListSuccessResponseSchema
>;

export type Homework = z.infer<typeof homeworkSchema>;

export type HomeworkDetailsResponse = z.infer<
	typeof homeworkDetailsSuccessResponseSchema
>;

export interface CreateHomework {
	homework: CreateHomeworkFields;
}

export type CreateHomeworkValidationError = ValidationError<
	Record<keyof CreateHomeworkFields, string[]>
>;

export type CreateHomeworkSuccessResponse = z.infer<
	typeof createHomeworkSuccessResponseSchema
>;

export interface UpdateHomework {
	homeworkId: string;
	homework: CreateHomeworkFields;
}

export type UpdateHomeworkValidationError = ValidationError<
	Record<keyof CreateHomeworkFields, string[]>
>;

export type UpdateHomeworkSuccessResponse = z.infer<
	typeof updateHomeworkSuccessResponseSchema
>;

export interface CreateHomeworkStudentAnswer {
	answer: CreateHomeworkStudentAnswerFields;
	userId: string;
}

export type CreateHomeworkStudentAnswerValidationError = ValidationError<
	Record<keyof CreateHomeworkStudentAnswerFields, string[]>
>;

export type CreateHomeworkStudentAnswerSuccessResponse = z.infer<
	typeof createHomeworkStudentAnswerSuccessResponseSchema
>;

export interface UpdateHomeworkStudentAnswer {
	answerId: string;
	answer: CreateHomeworkStudentAnswerFields;
	userId: string;
}

export type UpdateHomeworkStudentAnswerValidationError = ValidationError<
	Record<keyof CreateHomeworkStudentAnswerFields, string[]>
>;

export type UpdateHomeworkStudentAnswerSuccessResponse = z.infer<
	typeof updateHomeworkStudentAnswerSuccessResponseSchema
>;

export interface CreateHomeworkTeacherAnswer {
	answer: CreateHomeworkTeacherAnswerFields;
}

export type CreateHomeworkTeacherAnswerValidationError = ValidationError<
	Record<keyof CreateHomeworkTeacherAnswerFields, string[]>
>;

export type CreateHomeworkTeacherAnswerSuccessResponse = z.infer<
	typeof createHomeworkTeacherAnswerSuccessResponseSchema
>;

export interface UpdateHomeworkTeacherAnswer {
	answerId: string;
	answer: CreateHomeworkTeacherAnswerFields;
}

export type UpdateHomeworkTeacherAnswerValidationError = ValidationError<
	Record<keyof CreateHomeworkTeacherAnswerFields, string[]>
>;

export type UpdateHomeworkTeacherAnswerSuccessResponse = z.infer<
	typeof updateHomeworkTeacherAnswerSuccessResponseSchema
>;
