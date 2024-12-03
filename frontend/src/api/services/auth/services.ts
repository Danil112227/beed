import { axiosRequest } from "@api/lib/axios";

import {
	LOGIN_USER_URL,
	GET_SELF_USER_DATA_URL,
	LOGOUT_USER_URL,
} from "./constants";

import {
	userAuthSuccessResponseSchema,
	userSelfSuccessResponseSchema,
	logoutUserSuccessResponseSchema,
} from "./schemas";

import { errorSchema } from "@api/schemas";

import { AuthorizeUserParams, GetSelfUserData } from "./types";

export async function authorizeUser({ body }: AuthorizeUserParams) {
	const result = await axiosRequest({
		url: LOGIN_USER_URL(),
		method: "post",
		body,
	});

	const validatedAuthResult = userAuthSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedAuthResult.success) {
		return validatedAuthResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedAuthResult.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getSelfUserData({ signal }: GetSelfUserData) {
	const user = await axiosRequest({
		signal,
		url: GET_SELF_USER_DATA_URL(),
	});

	if (!user) {
		return null;
	}

	const validatedSelfUserData = userSelfSuccessResponseSchema.safeParse(user);
	const validatedError = errorSchema.safeParse(user);

	if (validatedSelfUserData.success) {
		return validatedSelfUserData.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedSelfUserData.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function logoutUser() {
	const result = await axiosRequest({
		url: LOGOUT_USER_URL(),
		method: "post",
	});

	const validatedLogoutUser = logoutUserSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedLogoutUser.success) {
		return validatedLogoutUser.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	throw { title: "Error!", message: "Something went wrong!" };
}
