import { BEED_BASE_URL } from "@api/constants";

import { SCHOOLS_API } from "../schools";

export const GET_GRADE_LIST_URL = (query: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/grade" + query;
export const DELETE_GRADE_URL = (gradeId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/grade/" + gradeId + "/";
export const CREATE_GRADE_URL = () => BEED_BASE_URL + SCHOOLS_API + "/grade/";
export const UPDATE_GRADE_URL = (gradeId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/grade/" + gradeId + "/";
export const GET_GRADE_URL = (gradeId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/grade/" + gradeId;
