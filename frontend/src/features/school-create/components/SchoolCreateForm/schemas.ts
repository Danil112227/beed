import { z } from "zod";

import { PeriodTypesEnum } from "@api/services/schools";

export const periodSchema = z.object({
	periodType: z.nativeEnum(PeriodTypesEnum),
	dates: z.tuple([z.date(), z.date()]),
});

export const createSchoolFormSchema = z.object({
	name: z.string().min(1),
	school_timezone: z.string(),
	text: z.string().min(1),
	periods: z.array(periodSchema),
	email: z.string(),
	wats_app: z.string(),
	first_name: z.string(),
	last_name: z.string(),
});
