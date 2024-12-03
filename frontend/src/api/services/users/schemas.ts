import { z } from "zod";

import { UserTypesEnum } from "./constants";

import { paginationSchema } from "@api/schemas";

const userTypeSchema = z.nativeEnum(UserTypesEnum);

export const disciplineShortSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const schoolShortSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const gradeShortSchema = z.object({
	id: z.number(),
	name: z.string(),
	school: schoolShortSchema,
	year: z.number(),
});

export const userShortSchema = z.object({
	id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	Patronymic: z.string(),
	username: z.string(),
	type: userTypeSchema,
	grades: z.array(gradeShortSchema),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
});

export const userSchema = z.object({
	id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	Patronymic: z.string(),
	email: z.string().email(),
	username: z.string(),
	type: userTypeSchema,
	user_timezone: z.number(),
	user_timezone_text: z.string(),
	birthday: z.string().date(),
	city: z.string(),
	phone: z.string(),
	child: z.array(userShortSchema),
	my_grades: z.array(gradeShortSchema),
	disciplines: z.array(disciplineShortSchema),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
	can_super_login: z.boolean(),
});

export const usersListExtendedSuccessResponseSchema = z
	.object({
		results: z.array(userSchema),
	})
	.extend(paginationSchema.shape);

export const usersListShortSuccessResponseSchema = z
	.object({
		results: z.array(userShortSchema),
	})
	.extend(paginationSchema.shape);

export const userDetailsShortSuccessResponseSchema = userShortSchema;

export const userDetailsExtendedSuccessResponseSchema = userSchema;

export const createUserSuccessResponseSchema = userSchema
	.omit({
		user_timezone: true,
		my_grades: true,
		disciplines: true,
		child: true,
	})
	.extend({ user_timezone: z.string(), child: z.array(z.number()) });

export const updateUserSuccessResponseSchema = userSchema
	.omit({
		user_timezone: true,
		my_grades: true,
		disciplines: true,
		child: true,
	})
	.extend({ user_timezone: z.string(), child: z.array(z.number()) });

export const deleteUserSuccessResponseSchema = z.string();
