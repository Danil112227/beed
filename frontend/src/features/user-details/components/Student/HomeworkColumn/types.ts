import { Homework } from "@api/services/homework";

export interface HomeworkColumnProps {
	columnDate: string;
	homeworks: Homework[];
	onOpenViewHomeworkDialog: () => void;
}
