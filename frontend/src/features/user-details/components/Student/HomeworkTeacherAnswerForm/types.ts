import { z } from "zod";
import { createHomeworkTeacherAnswerFormSchema } from "./schemas";

export type CreateHomeworkTeacherAnswerFields = z.infer<
	typeof createHomeworkTeacherAnswerFormSchema
>;
