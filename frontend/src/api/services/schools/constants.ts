import { BEED_BASE_URL } from "@api/constants";

export const SCHOOLS_API = "/api/schools";

export const GET_SCHOOL_LIST_URL = (query: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/school" + query;
export const DELETE_SCHOOL_URL = (schoolId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/school/" + schoolId + "/";
export const CREATE_SCHOOL_URL = () => BEED_BASE_URL + SCHOOLS_API + "/school/";
export const GET_SCHOOL_URL = (schoolId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/school/" + schoolId;
export const UPDATE_SCHOOL_URL = (schoolId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/school/" + schoolId + "/";

export enum PeriodTypesEnum {
	WORK_DAY = "work day",
	DAY_OFF = "day off",
}
