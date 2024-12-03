import { z } from "zod";

export const paginationSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
});

export const errorSchema = z.object({
	status: z.number(),
	data: z.unknown(),
});

export const validationErrorSchema = errorSchema.extend({
	data: z.record(z.string(), z.array(z.string())),
});
