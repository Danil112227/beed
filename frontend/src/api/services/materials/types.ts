import { z } from "zod";

import {
	materialsListSuccessResponseSchema,
	userSchema,
	documentSchema,
	createMaterialSuccessResponseSchema,
	updateMaterialSuccessResponseSchema,
	materialDetailsSuccessResponseSchema,
	lessonMaterialsListSuccessResponseSchema,
	lessonMaterialDetailsSuccessResponseSchema,
	createLessonMaterialSuccessResponseSchema,
	updateLessonMaterialSuccessResponseSchema,
} from "./schemas";

import { CreateMaterialFields } from "@features/user-details";
import { ValidationError } from "@api/types";

export interface GetMaterialsParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
	isLesson?: boolean;
}

export interface MaterialsQueryType
	extends MaterialListQueryType,
		MaterialDetailsQueryType {}

export interface MaterialListQueryType {
	materials: MaterialsListResponse;
	"lesson-materials": LessonMaterialsListResponse;
}

export interface MaterialDetailsQueryType {
	"material-details": MaterialDetailsShortResponse;
	"lesson-material-details": LessonMaterialDetailsResponse;
}

export interface GetMaterialDetailsPayload {
	id: string;
}

export interface GetLessonMaterialDetailsPayload {
	id: string;
}

export interface MaterialsPayload {
	"material-details": GetMaterialDetailsPayload;
	materials: undefined;
	"lesson-materials": undefined;
	"lesson-material-details": GetLessonMaterialDetailsPayload;
}

export interface GetMaterialDetailsParams {
	signal?: AbortSignal;
	payload: GetMaterialDetailsPayload;
	isLesson?: boolean;
}

export interface UseMaterialsQueryParams<T extends keyof MaterialsQueryType> {
	isEnabled: boolean;
	isPaginationEnabled?: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	searchParams?: Record<string, unknown>;
	payload?: MaterialsPayload[T];
}

export type MaterialsListResponse = z.infer<
	typeof materialsListSuccessResponseSchema
>;

export type LessonMaterialsListResponse = z.infer<
	typeof lessonMaterialsListSuccessResponseSchema
>;

export type UserMaterial = z.infer<typeof userSchema>;

export type DocumentMaterial = z.infer<typeof documentSchema>;

export interface CreateMaterial {
	material: CreateMaterialFields;
}

export type CreateMaterialValidationError = ValidationError<
	Record<keyof CreateMaterialFields, string[]>
>;

export type CreateMaterialSuccessResponse = z.infer<
	typeof createMaterialSuccessResponseSchema
>;

export type CreateLessonMaterialSuccessResponse = z.infer<
	typeof createLessonMaterialSuccessResponseSchema
>;

export interface UpdateMaterial {
	materialId: string;
	material: CreateMaterialFields;
}

export type UpdateMaterialValidationError = ValidationError<
	Record<keyof CreateMaterialFields, string[]>
>;

export type UpdateMaterialSuccessResponse = z.infer<
	typeof updateMaterialSuccessResponseSchema
>;

export type UpdateLessonMaterialSuccessResponse = z.infer<
	typeof updateLessonMaterialSuccessResponseSchema
>;

export interface DeleteMaterial {
	materialId: string;
	isLessonOperation: boolean;
}

export type MaterialDetailsShortResponse = z.infer<
	typeof materialDetailsSuccessResponseSchema
>;

export type LessonMaterialDetailsResponse = z.infer<
	typeof lessonMaterialDetailsSuccessResponseSchema
>;
