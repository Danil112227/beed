import { z } from "zod";

import { editStudentListFormSchema } from "./schemas";

export interface EditStudentListDialogProps {
	isVisible: boolean;
	onClose: () => void;
}

export type EditStudentListFields = z.infer<typeof editStudentListFormSchema>;
