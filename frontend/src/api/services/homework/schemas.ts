import { z } from "zod";

import { HomeworkTypesEnum, HomeworkStatusEnum } from "./constants";
import { UserTypesEnum } from "../users";

import { paginationSchema } from "@api/schemas";

const userTypeSchema = z.nativeEnum(UserTypesEnum);

const disciplineSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const authorSchema = z.object({
	id: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	Patronymic: z.string(),
	username: z.string(),
	type: userTypeSchema,
	disciplines: z.array(disciplineSchema),
});

const documentSchema = z.object({
	id: z.number(),
	file: z.string(),
	author: z.number(),
});

const lessonSchema = z.object({
	id: z.number(),
	title: z.string(),
	lesson_link: z.string(),
});

const homeworkTypeSchema = z.nativeEnum(HomeworkTypesEnum);

const homeworkStatusSchema = z.nativeEnum(HomeworkStatusEnum);

const studentHomeworkSchema = z.object({
	id: z.number(),
	type: homeworkTypeSchema,
	author: authorSchema,
	description: z.string(),
	deadline: z.coerce.date(),
	documents: z.array(documentSchema),
});

export const homeworkStudentAnswerSchema = z.object({
	id: z.number(),
	author: authorSchema,
	homework: studentHomeworkSchema,
	description: z.string(),
	documents: z.array(documentSchema),
	status: homeworkStatusSchema,
	can_delete: z.boolean(),
	can_edit: z.boolean(),
});

export const homeworkTeacherAnswerSchema = z.object({
	id: z.number(),
	author: authorSchema,
	answer: homeworkStudentAnswerSchema.extend({
		can_delete: z.boolean().optional(),
		can_edit: z.boolean().optional(),
	}),
	description: z.string(),
	documents: z.array(documentSchema),
	can_delete: z.boolean(),
	can_edit: z.boolean(),
});

export const homeworkSchema = z.object({
	id: z.number(),
	type: homeworkTypeSchema,
	author: authorSchema,
	lesson: lessonSchema,
	description: z.string(),
	deadline: z.coerce.date(),
	documents: z.array(documentSchema),
	status: homeworkStatusSchema.optional(),
	answer: homeworkStudentAnswerSchema.nullable().optional(),
	teacher_answer: homeworkTeacherAnswerSchema.nullable().optional(),
});

export const homeworkStudentAnswerListSuccessResponseSchema = z
	.object({
		results: z.array(homeworkStudentAnswerSchema),
	})
	.extend(paginationSchema.shape);

export const homeworkTeacherAnswerListSuccessResponseSchema = z
	.object({
		results: z.array(homeworkTeacherAnswerSchema),
	})
	.extend(paginationSchema.shape);

export const homeworkListSuccessResponseSchema = z
	.object({
		results: z.array(homeworkSchema),
	})
	.extend(paginationSchema.shape);

export const homeworkDetailsSuccessResponseSchema = homeworkSchema.extend({
	can_delete: z.boolean().optional(),
	can_edit: z.boolean().optional(),
});

export const deleteHomeworkSuccessResponseSchema = z.string();

export const createHomeworkSuccessResponseSchema = homeworkSchema
	.pick({
		id: true,
		deadline: true,
		description: true,
		author: true,
	})
	.extend({ lesson: z.number(), documents: z.array(z.number()) });

export const updateHomeworkSuccessResponseSchema = homeworkSchema
	.pick({
		id: true,
		deadline: true,
		description: true,
		author: true,
	})
	.extend({ lesson: z.number(), documents: z.array(z.number()) });

export const createHomeworkStudentAnswerSuccessResponseSchema =
	homeworkStudentAnswerSchema
		.pick({
			id: true,
			description: true,
			author: true,
			status: true,
		})
		.extend({ homework: z.number(), documents: z.array(z.number()) });

export const updateHomeworkStudentAnswerSuccessResponseSchema =
	homeworkStudentAnswerSchema
		.pick({
			id: true,
			description: true,
			author: true,
			status: true,
		})
		.extend({ homework: z.number(), documents: z.array(z.number()) });

export const createHomeworkTeacherAnswerSuccessResponseSchema =
	homeworkStudentAnswerSchema
		.pick({
			id: true,
			description: true,
			author: true,
			status: true,
		})
		.extend({ answer: z.number(), documents: z.array(z.number()) });

export const updateHomeworkTeacherAnswerSuccessResponseSchema =
	homeworkStudentAnswerSchema
		.pick({
			id: true,
			description: true,
			author: true,
			status: true,
		})
		.extend({ answer: z.number(), documents: z.array(z.number()) });
