import { z } from "zod";

import { signInSchema } from "./schemas";

export type SignInFields = z.infer<typeof signInSchema>;

export interface SignInFormProps {
	onForgotPassword: () => void;
}
