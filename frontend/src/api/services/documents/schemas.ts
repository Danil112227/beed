import { z } from "zod";

export const documentSchema = z.object({
	id: z.number(),
	file: z.string().url(),
	author: z.number(),
});

export const uploadDocumentsSuccessResponseSchema = documentSchema;
