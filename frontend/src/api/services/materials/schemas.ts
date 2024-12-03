import { z } from "zod";

import { paginationSchema } from "@api/schemas";
import { UserTypesEnum } from "../users";

const userTypeSchema = z.nativeEnum(UserTypesEnum);

export const userSchema = z.object({
	id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	Patronymic: z.string(),
	username: z.string(),
	type: userTypeSchema,
	grades: z.array(z.unknown()),
	disciplines: z.array(z.unknown()),
});

export const documentSchema = z.object({
	id: z.number(),
	file: z.string().url(),
	author: z.number(),
});

export const materialSchema = z.object({
	id: z.number(),
	author: userSchema,
	topic: z.string(),
	user: userSchema,
	description: z.string(),
	documents: z.array(documentSchema),
	date_added: z.string().datetime(),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
});

const lessonSchema = z.object({
	id: z.number(),
});

export const lessonMaterialSchema = z.object({
	id: z.number(),
	author: userSchema,
	topic: z.string(),
	lesson: lessonSchema,
	description: z.string(),
	documents: z.array(documentSchema),
	date_added: z.string().datetime(),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
});

export const lessonMaterialsListSuccessResponseSchema = z
	.object({
		results: z.array(lessonMaterialSchema),
	})
	.extend(paginationSchema.shape);

export const materialsListSuccessResponseSchema = z
	.object({
		results: z.array(materialSchema),
	})
	.extend(paginationSchema.shape);

export const createMaterialSuccessResponseSchema = materialSchema
	.pick({
		id: true,
		author: true,
		topic: true,
		description: true,
	})
	.extend({ user: z.number(), documents: z.array(z.number()) });

export const createLessonMaterialSuccessResponseSchema = materialSchema
	.pick({
		id: true,
		author: true,
		topic: true,
		description: true,
	})
	.extend({ lesson: z.number(), documents: z.array(z.number()) });

export const updateMaterialSuccessResponseSchema = materialSchema
	.pick({
		id: true,
		author: true,
		topic: true,
		description: true,
	})
	.extend({ user: z.number(), documents: z.array(z.number()) });

export const updateLessonMaterialSuccessResponseSchema = materialSchema
	.pick({
		id: true,
		author: true,
		topic: true,
		description: true,
	})
	.extend({ lesson: z.number(), documents: z.array(z.number()) });

export const deleteMaterialSuccessResponseSchema = z.string();

export const materialDetailsSuccessResponseSchema = materialSchema;

export const lessonMaterialDetailsSuccessResponseSchema = lessonMaterialSchema;
