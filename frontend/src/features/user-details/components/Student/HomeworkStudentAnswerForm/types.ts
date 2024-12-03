import { z } from "zod";
import { createHomeworkStudentAnswerFormSchema } from "./schemas";

export type CreateHomeworkStudentAnswerFields = z.infer<
	typeof createHomeworkStudentAnswerFormSchema
>;
