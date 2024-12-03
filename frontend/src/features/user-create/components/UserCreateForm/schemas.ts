import { z } from "zod";

import { UserTypesEnum } from "@api/services/users";

export const createUserFormSchema = z.object({
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	Patronymic: z.string(),
	type: z.nativeEnum(UserTypesEnum),
	child: z.array(z.number()).nullable(),
	username: z.string().min(1),
	user_timezone: z.string(),
	birthday: z.date(),
	email: z.string().email(),
	city: z.string(),
	phone: z.string(),
});
