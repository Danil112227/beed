import { Grade } from "@api/services/grade";

export interface ClassesListProps {
	isEditable?: boolean;
	classes: Grade[];
}
