import { BEED_BASE_URL } from "@api/constants";

const USERS_API = "/api/users";

export const GET_USER_LIST_URL = (query: string) =>
	BEED_BASE_URL + USERS_API + "/users" + query;
export const GET_USER_LIST_EXTENDED_URL = (query: string) =>
	BEED_BASE_URL + USERS_API + "/users_profile" + query;
export const GET_USER_DETAILS_URL = (userId: string) =>
	BEED_BASE_URL + USERS_API + "/users/" + userId;
export const GET_USER_DETAILS_EXTENDED_URL = (userId: string) =>
	BEED_BASE_URL + USERS_API + "/users_profile/" + userId;
export const CREATE_USER_URL = () =>
	BEED_BASE_URL + USERS_API + "/users_profile/";
export const UPDATE_USER_URL = (userId: string) =>
	BEED_BASE_URL + USERS_API + "/users_profile/" + userId + "/";
export const DELETE_USER_URL = (materialId: string) =>
	BEED_BASE_URL + USERS_API + "/users_profile/" + materialId + "/";
export const RESET_PASSWORD_URL = () =>
	BEED_BASE_URL + USERS_API + "/reset-password/";
export const SUPER_LOGIN_URL = () =>
	BEED_BASE_URL + USERS_API + "/super_login/";

export enum UserTypesEnum {
	STUDENT = 0,
	TEACHER = 1,
	TUTOR = 2,
	PARENT = 3,
}
