import { z } from "zod";

import { paginationSchema } from "@api/schemas";
import { userSchema } from "../users";

const disciplineShortSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const teacherSchema = userSchema
	.pick({
		id: true,
		first_name: true,
		last_name: true,
		Patronymic: true,
		username: true,
		type: true,
	})
	.extend({
		disciplines: z.array(disciplineShortSchema),
	});

export const disciplineSchema = z.object({
	id: z.number(),
	name: z.string(),
	teacher: teacherSchema,
	description: z.string(),
});

export const disciplinesListSuccessResponseSchema = z
	.object({
		results: z.array(disciplineSchema),
	})
	.extend(paginationSchema.shape);

export const createDisciplineSuccessResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	teacher: z.number(),
	description: z.string(),
	default_link: z.string(),
});

export const deleteDisciplineSuccessResponseSchema = z.string();
