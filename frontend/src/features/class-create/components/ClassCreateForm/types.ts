import { z } from "zod";
import { createClassFormSchema } from "./schemas";

export type CreateClassFields = z.infer<typeof createClassFormSchema>;
