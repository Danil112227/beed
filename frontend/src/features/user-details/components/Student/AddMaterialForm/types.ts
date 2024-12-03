import { z } from "zod";
import { createMaterialFormSchema } from "./schemas";

export type CreateMaterialFields = z.infer<typeof createMaterialFormSchema>;
