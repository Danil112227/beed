import { z } from "zod";

export const editStudentListFormSchema = z.object({
	students: z.array(z.number()),
});
