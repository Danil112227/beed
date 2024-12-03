import { z } from "zod";

export const createClassFormSchema = z.object({
	name: z.string().min(1),
	school: z.number(),
	description: z.string(),
	year: z.coerce.number().optional(),
	tutor: z.array(z.number()).nullable(),
});
