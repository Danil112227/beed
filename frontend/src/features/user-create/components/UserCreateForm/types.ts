import { z } from "zod";
import { createUserFormSchema } from "./schemas";

export type CreateUserFields = z.infer<typeof createUserFormSchema>;
