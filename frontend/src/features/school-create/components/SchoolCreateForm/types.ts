import { z } from "zod";
import { createSchoolFormSchema, periodSchema } from "./schemas";

export type CreateSchoolFields = z.infer<typeof createSchoolFormSchema>;

export type Period = z.infer<typeof periodSchema>;
