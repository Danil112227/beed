import { format } from "date-fns";

import { axiosRequest } from "@api/lib/axios";

import {
	GET_USER_LIST_URL,
	GET_USER_LIST_EXTENDED_URL,
	GET_USER_DETAILS_EXTENDED_URL,
	GET_USER_DETAILS_URL,
	CREATE_USER_URL,
	UPDATE_USER_URL,
	DELETE_USER_URL,
	RESET_PASSWORD_URL,
	SUPER_LOGIN_URL,
} from "./constants";

import {
	usersListExtendedSuccessResponseSchema,
	usersListShortSuccessResponseSchema,
	userDetailsExtendedSuccessResponseSchema,
	userDetailsShortSuccessResponseSchema,
	deleteUserSuccessResponseSchema,
	createUserSuccessResponseSchema,
	updateUserSuccessResponseSchema,
} from "./schemas";
import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetUsersParams,
	GetUserDetailsParams,
	CreateUser,
	UpdateUser,
	DeleteUser,
	ResetPassword,
	SuperLogin,
} from "./types";
import {userAuthSuccessResponseSchema} from "@api/services/auth";

export async function getUsers({
	isExtendedVersion,
	signal,
	searchParams,
}: GetUsersParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	let url = GET_USER_LIST_URL(queryString);

	if (isExtendedVersion) {
		url = GET_USER_LIST_EXTENDED_URL(queryString);
	}

	const users = await axiosRequest({
		signal,
		url,
	});

	if (!users) {
		return null;
	}

	const validatedUsers =
		usersListExtendedSuccessResponseSchema.safeParse(users);
	const validatedShortUsers =
		usersListShortSuccessResponseSchema.safeParse(users);
	const validatedError = errorSchema.safeParse(users);

	if (isExtendedVersion && validatedUsers.success) {
		return validatedUsers.data;
	} else if (!isExtendedVersion && validatedShortUsers.success) {
		return validatedShortUsers.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedUsers.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getUserDetails({
	isExtendedVersion,
	signal,
	payload,
}: GetUserDetailsParams) {
	const { id } = payload;

	let url = GET_USER_DETAILS_URL(id);

	if (isExtendedVersion) {
		url = GET_USER_DETAILS_EXTENDED_URL(id);
	}

	const user = await axiosRequest({
		signal,
		url,
	});

	if (!user) {
		return null;
	}

	const validatedUserDetails =
		userDetailsExtendedSuccessResponseSchema.safeParse(user);
	const validatedShortUserDetails =
		userDetailsShortSuccessResponseSchema.safeParse(user);
	const validatedError = errorSchema.safeParse(user);

	if (isExtendedVersion && validatedUserDetails.success) {
		return validatedUserDetails.data;
	} else if (!isExtendedVersion && validatedShortUserDetails.success) {
		return validatedShortUserDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedUserDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createUser({ user }: CreateUser) {
	const { user_timezone, birthday } = user;

	const [timezoneText, timezone] = user_timezone.split("|");

	const formattedUser = {
		...user,
		birthday: format(birthday, "yyyy-MM-dd"),
		user_timezone: timezone,
		user_timezone_text: timezoneText,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_USER_URL(),
		body: formattedUser,
	});

	const validatedUser = createUserSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedUser.success) {
		return validatedUser.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedUser.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateUser({ id, user }: UpdateUser) {
	const { user_timezone, birthday } = user;

	const [timezoneText, timezone] = user_timezone.split("|");

	const formattedUser = {
		...user,
		birthday: format(birthday, "yyyy-MM-dd"),
		user_timezone: timezone,
		user_timezone_text: timezoneText,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "put",
		url: UPDATE_USER_URL(id),
		body: formattedUser,
	});

	const validatedUser = updateUserSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedUser.success) {
		return validatedUser.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedUser.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteUser({ userId }: DeleteUser) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_USER_URL(userId),
	});

	const validatedResult = deleteUserSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function resetPassword({ username }: ResetPassword) {
	const formattedBody = {
		username,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: RESET_PASSWORD_URL(),
		body: formattedBody,
	});
	const validatedError = errorSchema.safeParse(result);

	if (validatedError.success) {
		throw validatedError.data;
	}

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function superLogin ({ username }: SuperLogin) {
	const formattedBody = {
		user: username,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: SUPER_LOGIN_URL(),
		body: formattedBody,
	});
	const validatedAuthResult = userAuthSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedAuthResult.success) {
		return validatedAuthResult.data;
	}else if (validatedError.success) {
		throw validatedError.data;
	}

	throw { title: "Error!", message: "Something went wrong!" };
}
