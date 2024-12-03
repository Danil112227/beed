import { z } from "zod";

export const createDisciplineFormSchema = z.object({
	name: z.string().min(1),
	teacher: z.number(),
	description: z.string().min(1),
	grades: z.number().nullable(),
	default_link: z.string(),
});
