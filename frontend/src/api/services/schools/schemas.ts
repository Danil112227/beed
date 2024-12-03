import { z } from "zod";

import { PeriodTypesEnum } from "./constants";

import { paginationSchema } from "@api/schemas";

export const periodSchema = z.object({
	start_date: z.string().date(),
	end_date: z.string().date(),
	type: z.nativeEnum(PeriodTypesEnum),
});

export const schoolSchema = z.object({
	id: z.number(),
	name: z.string(),
	school_timezone: z.number(),
	school_timezone_text: z.string(),
	periods: z.array(periodSchema).optional(),
	text: z.string(),
	email: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	wats_app: z.string(),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
});

export const schoolListSuccessResponseSchema = z
	.object({
		results: z.array(schoolSchema),
	})
	.extend(paginationSchema.shape);

export const deleteSchoolSuccessResponseSchema = z.string();

export const createSchoolSuccessResponseSchema = schoolSchema;

export const schoolDetailsSuccessResponseSchema = schoolSchema;

export const updateSchoolSuccessResponseSchema = schoolSchema;
