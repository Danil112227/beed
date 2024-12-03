import { School } from "@api/services/schools";

export interface DeleteSchoolDialogProps {
	isVisible: boolean;
	school: School;
	onClose: () => void;
}
