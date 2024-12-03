import { z } from "zod";

import { userSchema } from "../users";

export const userAuthDetailsSchema = userSchema
	.pick({
		id: true,
		first_name: true,
		last_name: true,
		Patronymic: true,
		username: true,
		type: true,
		// TODO: add grades and disciplines
	})
	.extend({ permissions: z.record(z.string(), z.boolean()) });

export const userAuthSuccessResponseSchema = userAuthDetailsSchema;

export const userSelfSuccessResponseSchema = userAuthDetailsSchema;

export const logoutUserSuccessResponseSchema = z.object({
	success: z.string(),
});
