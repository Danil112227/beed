import { format } from "date-fns";

import { axiosRequest } from "@api/lib/axios";

import {
	GET_SCHOOL_LIST_URL,
	DELETE_SCHOOL_URL,
	CREATE_SCHOOL_URL,
	GET_SCHOOL_URL,
	UPDATE_SCHOOL_URL,
} from "./constants";

import {
	schoolListSuccessResponseSchema,
	deleteSchoolSuccessResponseSchema,
	createSchoolSuccessResponseSchema,
	schoolDetailsSuccessResponseSchema,
	updateSchoolSuccessResponseSchema,
} from "./schemas";

import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetSchoolParams,
	DeleteSchool,
	CreateSchool,
	GetSchoolDetailsParams,
	UpdateSchool,
} from "./types";

export async function getSchools({ signal, searchParams }: GetSchoolParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const schools = await axiosRequest({
		signal,
		url: GET_SCHOOL_LIST_URL(queryString),
	});

	if (!schools) {
		return null;
	}

	const validatedSchools = schoolListSuccessResponseSchema.safeParse(schools);
	const validatedError = errorSchema.safeParse(schools);

	if (validatedSchools.success) {
		return validatedSchools.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedSchools.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteSchool({ schoolId }: DeleteSchool) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_SCHOOL_URL(schoolId),
	});

	const validatedResult = deleteSchoolSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createSchool({ school }: CreateSchool) {
	const { school_timezone, periods } = school;

	const [timezoneText, timezone] = school_timezone.split("|");

	const formattedPeriods = periods.map((period) => {
		const [startDate, endDate] = period.dates;
		return {
			type: period.periodType,
			start_date: format(startDate, "yyyy-MM-dd"),
			end_date: format(endDate, "yyyy-MM-dd"),
		};
	});

	const formattedSchool = {
		...school,
		periods: formattedPeriods,
		school_timezone: timezone,
		school_timezone_text: timezoneText,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_SCHOOL_URL(),
		body: formattedSchool,
	});

	const validatedSchool = createSchoolSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedSchool.success) {
		return validatedSchool.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedSchool.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getSchoolDetails({
	signal,
	payload,
}: GetSchoolDetailsParams) {
	const { id } = payload;

	const school = await axiosRequest({
		signal,
		url: GET_SCHOOL_URL(id),
	});

	if (!school) {
		return null;
	}

	const validatedSchoolDetails =
		schoolDetailsSuccessResponseSchema.safeParse(school);
	const validatedError = errorSchema.safeParse(school);

	if (validatedSchoolDetails.success) {
		return validatedSchoolDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedSchoolDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateSchool({ school, schoolId }: UpdateSchool) {
	const { school_timezone, periods } = school;

	const [timezoneText, timezone] = school_timezone.split("|");

	const formattedPeriods = periods.map((period) => {
		const [startDate, endDate] = period.dates;
		return {
			type: period.periodType,
			start_date: format(startDate, "yyyy-MM-dd"),
			end_date: format(endDate, "yyyy-MM-dd"),
		};
	});

	const formattedSchool = {
		...school,
		periods: formattedPeriods,
		school_timezone: timezone,
		school_timezone_text: timezoneText,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "put",
		url: UPDATE_SCHOOL_URL(schoolId),
		body: formattedSchool,
	});

	const validatedSchool = updateSchoolSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedSchool.success) {
		return validatedSchool.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedSchool.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}
