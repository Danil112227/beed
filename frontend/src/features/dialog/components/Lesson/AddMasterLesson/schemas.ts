import { z } from "zod";

export const addMasterLessonFormSchema = z.object({
	title: z.string().min(1),
	lesson_link: z.string().min(1),
	grade: z.number(),
	discipline: z.number(),
	period: z.number(),
	day_of_week: z.string().min(1),
	duration: z.number(),
	start_time: z.string(),
	students: z.array(z.number()).nullable(),
});
