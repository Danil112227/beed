import { HomeworkStudentAnswer } from "@api/services/homework";

export interface StudentAnswerEditFormProps {
	isVisible: boolean;
	studentAnswer: HomeworkStudentAnswer;
	homeworkId: number;
	onClose: () => void;
}
