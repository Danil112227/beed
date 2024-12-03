import { HomeworkTeacherAnswer } from "@api/services/homework";

export interface TeacherAnswerEditFormProps {
	isVisible: boolean;
	teacherAnswer: HomeworkTeacherAnswer;
	onClose: () => void;
}
