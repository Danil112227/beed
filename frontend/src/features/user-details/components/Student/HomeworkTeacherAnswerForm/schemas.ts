import { z } from "zod";

import { documentSchema } from "@api/services/documents";
import { HomeworkStatusEnum } from "@api/services/homework";

const homeworkTypeSchema = z.nativeEnum(HomeworkStatusEnum);

export const createHomeworkTeacherAnswerFormSchema = z.object({
	answer: z.number(),
	description: z.string(),
	documents: z.array(documentSchema).optional(),
	status: homeworkTypeSchema,
});
