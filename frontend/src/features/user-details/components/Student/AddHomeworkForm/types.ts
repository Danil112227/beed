import { z } from "zod";
import { createHomeworkFormSchema } from "./schemas";

export type CreateHomeworkFields = z.infer<typeof createHomeworkFormSchema>;
