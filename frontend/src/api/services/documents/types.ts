import { z } from "zod";

import { documentSchema } from "./schemas";

export interface UploadDocuments {
	file: File;
}

export type Document = z.infer<typeof documentSchema>;
