import { z } from "zod";

import {
	lessonListSuccessResponseSchema,
	lessonDetailsSuccessResponseSchema,
	updateLessonStudentListSuccessResponseSchema,
	updateLessonSuccessResponseSchema,
	createPeriodSuccessResponseSchema,
	periodListSuccessResponseSchema,
	periodSchema,
	createMasterLessonSuccessResponseSchema,
	masterLessonListSuccessResponseSchema,
	updateMasterLessonSuccessResponseSchema,
	masterLessonDetailsSuccessResponseSchema,
} from "./schemas";
import {
	EditStudentListFields,
	AddPeriodFields,
	AddMasterLessonFields,
} from "@features/dialog";
import { EditLessonFields } from "@features/lesson-update";

import { ValidationError } from "@api/types";

export type Period = z.infer<typeof periodSchema>;

export interface GetLessons {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface GetMasterLessons {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface GetPeriods {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface GetLessonDetails {
	signal?: AbortSignal;
	payload: GetLessonDetailsPayload;
}

export interface GetMasterLessonDetails {
	signal?: AbortSignal;
	payload: GetLessonDetailsPayload;
}

export interface GetLessonDetailsPayload {
	id: string;
}

export interface GetMasterLessonDetailsPayload {
	id: string;
}

export interface LessonsQueryType
	extends LessonListQueryType,
		LessonDetailsQueryType {}

export interface LessonListQueryType {
	"master-lessons": MasterLessonsListResponse;
	lessons: LessonsListResponse;
	periods: PeriodListResponse;
}

export interface LessonDetailsQueryType {
	"lesson-details": LessonDetailsResponse;
	"master-lesson-details": MasterLessonDetailsResponse;
}

export interface LessonsPayload {
	"lesson-details": GetLessonDetailsPayload;
	"master-lessons": undefined;
	lessons: undefined;
	periods: undefined;
	"master-lesson-details": GetMasterLessonDetailsPayload;
}

export interface UseLessonQueryParams<T extends keyof LessonsQueryType> {
	isEnabled: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	isKeepPreviousData?: boolean;
	searchParams?: Record<string, unknown>;
	payload?: LessonsPayload[T];
}

export type PeriodListResponse = z.infer<
	typeof periodListSuccessResponseSchema
>;

export interface CreatePeriod {
	period: AddPeriodFields;
}

export type CreatePeriodValidationError = ValidationError<
	Record<keyof AddPeriodFields, string[]>
>;

export type CreatePeriodSuccessResponse = z.infer<
	typeof createPeriodSuccessResponseSchema
>;

export interface UpdateLessonStudentList {
	students: EditStudentListFields;
	lessonId: string;
}

export type UpdateLessonStudentListValidationError = ValidationError<
	Record<keyof EditStudentListFields, string[]>
>;

export type UpdateLessonStudentListSuccessResponse = z.infer<
	typeof updateLessonStudentListSuccessResponseSchema
>;

export interface UpdateMasterLesson {
	masterLessonId: string;
	masterLesson: AddMasterLessonFields;
}

export type UpdateMasterLessonValidationError = ValidationError<
	Record<keyof AddMasterLessonFields, string[]>
>;

export type UpdateMasterLessonSuccessResponse = z.infer<
	typeof updateMasterLessonSuccessResponseSchema
>;

export interface UpdateLesson {
	lessonId: string;
	lesson: EditLessonFields;
}

export type UpdateLessonValidationError = ValidationError<
	Record<keyof EditLessonFields, string[]>
>;

export type UpdateLessonSuccessResponse = z.infer<
	typeof updateLessonSuccessResponseSchema
>;

export type LessonsListResponse = z.infer<
	typeof lessonListSuccessResponseSchema
>;

export type MasterLessonsListResponse = z.infer<
	typeof masterLessonListSuccessResponseSchema
>;

export type LessonDetailsResponse = z.infer<
	typeof lessonDetailsSuccessResponseSchema
>;

export type MasterLessonDetailsResponse = z.infer<
	typeof masterLessonDetailsSuccessResponseSchema
>;

export interface DeleteLesson {
	lessonId: string;
}

export interface DeleteMasterLesson {
	masterLessonId: string;
}

export interface CreateMasterLesson {
	lesson: AddMasterLessonFields;
}

export type CreateMasterLessonValidationError = ValidationError<
	Record<keyof AddMasterLessonFields, string[]>
>;

export type CreateMasterLessonSuccessResponse = z.infer<
	typeof createMasterLessonSuccessResponseSchema
>;
