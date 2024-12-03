export { useHomeworksQuery } from "./useHomeworksQuery";

export {
	deleteHomework,
	createHomework,
	updateHomework,
	createHomeworkStudentAnswer,
	updateHomeworkStudentAnswer,
	createHomeworkTeacherAnswer,
	updateHomeworkTeacherAnswer,
} from "./services";

export { HomeworkTypesEnum, HomeworkStatusEnum } from "./constants";

export type {
	Homework,
	UpdateHomework,
	UpdateHomeworkSuccessResponse,
	UpdateHomeworkValidationError,
	CreateHomework,
	CreateHomeworkSuccessResponse,
	CreateHomeworkValidationError,
	CreateHomeworkStudentAnswer,
	CreateHomeworkStudentAnswerSuccessResponse,
	CreateHomeworkStudentAnswerValidationError,
	UpdateHomeworkStudentAnswer,
	UpdateHomeworkStudentAnswerSuccessResponse,
	UpdateHomeworkStudentAnswerValidationError,
	CreateHomeworkTeacherAnswer,
	CreateHomeworkTeacherAnswerSuccessResponse,
	CreateHomeworkTeacherAnswerValidationError,
	UpdateHomeworkTeacherAnswer,
	UpdateHomeworkTeacherAnswerSuccessResponse,
	UpdateHomeworkTeacherAnswerValidationError,
	HomeworkStudentAnswer,
	HomeworkTeacherAnswer,
} from "./types";
