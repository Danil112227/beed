import { z } from "zod";
import { editLessonFormSchema } from "./schemas";

export type EditLessonFields = z.infer<typeof editLessonFormSchema>;