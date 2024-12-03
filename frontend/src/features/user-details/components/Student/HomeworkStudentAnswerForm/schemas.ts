import { z } from "zod";

import { documentSchema } from "@api/services/documents";

export const createHomeworkStudentAnswerFormSchema = z.object({
	homework: z.number(),
	description: z.string(),
	documents: z.array(documentSchema).optional(),
});
