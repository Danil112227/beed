import { BEED_BASE_URL } from "@api/constants";

const HOMEWORK_API = "/api/homeworks";

export const GET_HOMEWORK_LIST_URL = (query: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/homeworks" + query;
export const GET_HOMEWORK_URL = (homeworkId: string, query: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/homeworks/" + homeworkId + query;
export const CREATE_HOMEWORK_URL = () =>
	BEED_BASE_URL + HOMEWORK_API + "/homeworks/";
export const UPDATE_HOMEWORK_URL = (homeworkId: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/homeworks/" + homeworkId + "/";
export const DELETE_HOMEWORK_URL = (homeworkId: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/homeworks/" + homeworkId + "/";

export const GET_HOMEWORK_STUDENT_ANSWER_LIST_URL = (query: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/answers" + query;
export const CREATE_HOMEWORK_STUDENT_ANSWER_URL = (userId: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/answers/" + "?user=" + userId;
export const UPDATE_HOMEWORK_STUDENT_ANSWER_URL = (
	answerId: string,
	userId: string,
) =>
	BEED_BASE_URL +
	HOMEWORK_API +
	"/answers/" +
	answerId +
	"/" +
	"?user=" +
	userId;

export const GET_HOMEWORK_TEACHER_ANSWER_LIST_URL = (query: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/teacher_answers" + query;
export const CREATE_HOMEWORK_TEACHER_ANSWER_URL = () =>
	BEED_BASE_URL + HOMEWORK_API + "/teacher_answers/";
export const UPDATE_HOMEWORK_TEACHER_ANSWER_URL = (answerId: string) =>
	BEED_BASE_URL + HOMEWORK_API + "/teacher_answers/" + answerId + "/";

export enum HomeworkTypesEnum {
	HOMEWORK = 0,
	PROJECT = 1,
}

export enum HomeworkStatusEnum {
	ASSIGNED = 0,
	DONE = 1,
	UNDONE = 2,
	UNDER_REVIEW = 3,
}
