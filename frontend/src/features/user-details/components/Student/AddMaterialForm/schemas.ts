import { z } from "zod";

const documentSchema = z.object({
	id: z.number(),
	file: z.string().url(),
	author: z.number(),
});

export const createMaterialFormSchema = z.object({
	topic: z.string().min(1),
	user: z.number().optional(),
	lesson: z.number().optional(),
	description: z.string().min(1),
	documents: z.array(documentSchema).optional(),
});
