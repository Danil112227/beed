import { z } from "zod";

export const addPeriodFormSchema = z.object({
	grade: z.number(),
	periodDates: z.array(z.date()),
});
