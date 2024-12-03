import { Homework } from "@api/services/homework";

export interface HomeworkItemProps {
	homework: Homework;
	onOpenViewHomeworkDialog: () => void;
}
