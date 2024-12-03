import { z } from "zod";

export const editLessonFormSchema = z.object({
	discipline: z.number(),
	title: z.string().min(1),
	description: z.string(),
	temp_teacher: z.number().nullable(),
	lesson_link: z.string().min(1),
	grade: z.number(),
	students: z.array(z.number()).nullable(),
});
