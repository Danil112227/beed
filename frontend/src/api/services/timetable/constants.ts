import { BEED_BASE_URL } from "@api/constants";

const TIMETABLE_API = "/api/timetable";

export const GET_LESSON_LIST_URL = (query: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/lesson" + query;
export const GET_LESSON_URL = (lessonId: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/lesson/" + lessonId;
export const UPDATE_LESSON_URL = (lessonId: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/lesson/" + lessonId + "/";
export const DELETE_LESSON_URL = (lessonId: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/lesson/" + lessonId + "/";

export const CREATE_PERIOD_URL = () =>
	BEED_BASE_URL + TIMETABLE_API + "/period/";

export const GET_PERIOD_LIST_URL = (query: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/period" + query;

export const CREATE_MASTER_LESSON_URL = () =>
	BEED_BASE_URL + TIMETABLE_API + "/master_lesson/";
export const GET_MASTER_LESSON_LIST = (query: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/master_lesson" + query;
export const GET_MASTER_LESSON_URL = (masterLessonId: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/master_lesson/" + masterLessonId;
export const UPDATE_MASTER_LESSON_URL = (masterLessonId: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/master_lesson/" + masterLessonId + "/";
export const DELETE_MASTER_LESSON_URL = (masterLessonId: string) =>
	BEED_BASE_URL + TIMETABLE_API + "/master_lesson/" + masterLessonId + "/";
