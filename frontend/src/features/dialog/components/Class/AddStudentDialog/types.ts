import { z } from "zod";

import { addGradeStudentFormSchema } from "./schemas";

export interface AddStudentDialogProps {
	isVisible: boolean;
	onClose: () => void;
}

export type AddGradeStudentsFields = z.infer<typeof addGradeStudentFormSchema>;
