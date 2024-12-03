import { z } from "zod";

import { addPeriodFormSchema } from "./schemas";

export interface AddPeriodDialogProps {
	gradeId?: string;
	isVisible: boolean;
	onClose: () => void;
}

export type AddPeriodFields = z.infer<typeof addPeriodFormSchema>;
