import { z } from "zod";

import { addMasterLessonFormSchema } from "./schemas";

export interface AddMasterLessonDialogProps {
	isVisible: boolean;
	onClose: () => void;
}

export type AddMasterLessonFields = z.infer<typeof addMasterLessonFormSchema>;
