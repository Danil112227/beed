import { z } from "zod";

import { HomeworkTypesEnum } from "@api/services/homework";

const homeworkTypeSchema = z.nativeEnum(HomeworkTypesEnum);

const documentSchema = z.object({
	id: z.number(),
	file: z.string().url(),
	author: z.number(),
});

export const createHomeworkFormSchema = z.object({
	type: homeworkTypeSchema,
	lesson: z.number(),
	deadline: z.coerce.date(),
	description: z.string().min(1),
	documents: z.array(documentSchema).optional(),
});
