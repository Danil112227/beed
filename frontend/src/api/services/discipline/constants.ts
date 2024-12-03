import { BEED_BASE_URL } from "@api/constants";

import { SCHOOLS_API } from "../schools";

export const GET_DISCIPLINE_LIST_URL = (query: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/discipline" + query;
export const CREATE_DISCIPLINE_URL = () =>
	BEED_BASE_URL + SCHOOLS_API + "/discipline/";
export const DELETE_DISCIPLINE_URL = (disciplineId: string) =>
	BEED_BASE_URL + SCHOOLS_API + "/discipline/" + disciplineId + "/";
