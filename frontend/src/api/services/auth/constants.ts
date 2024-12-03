import { BEED_BASE_URL } from "@api/constants";

const AUTH_API = "/api/users";

export const LOGIN_USER_URL = () => BEED_BASE_URL + AUTH_API + "/login/";
export const LOGOUT_USER_URL = () => BEED_BASE_URL + AUTH_API + "/logout/";
export const GET_SELF_USER_DATA_URL = () => BEED_BASE_URL + AUTH_API + "/self";
