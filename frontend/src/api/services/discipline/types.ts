import { z } from "zod";

import {
	disciplinesListSuccessResponseSchema,
	teacherSchema,
	createDisciplineSuccessResponseSchema,
	disciplineSchema,
} from "./schemas";

import { CreateDisciplineFields } from "@features/discipline-create";

import { ValidationError } from "@api/types";

export interface GetDisciplinesParams {
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface DeisciplinesQueryType {
	disciplines: DisciplinesListResponse;
}

export interface UseDisciplinesQueryParams<
	T extends keyof DeisciplinesQueryType,
> {
	isEnabled: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	searchParams?: Record<string, unknown>;
}

export type DisciplinesListResponse = z.infer<
	typeof disciplinesListSuccessResponseSchema
>;

export type Teacher = z.infer<typeof teacherSchema>;

export type Discipline = z.infer<typeof createDisciplineSuccessResponseSchema>;

export interface CreateDiscipline {
	discipline: CreateDisciplineFields;
}

export type CreateDisciplineValidationError = ValidationError<
	Record<keyof Omit<Discipline, "id" | "default_link">, string[]>
>;

export interface DeleteDiscipline {
	disciplineId: string;
}

export type DisciplineExtend = z.infer<typeof disciplineSchema>;
