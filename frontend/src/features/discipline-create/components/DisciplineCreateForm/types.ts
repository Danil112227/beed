import { z } from "zod";
import { createDisciplineFormSchema } from "./schemas";

export type CreateDisciplineFields = z.infer<typeof createDisciplineFormSchema>;
