import { z } from "zod";

export const addGradeStudentFormSchema = z.object({
	users: z.array(z.number()),
});
