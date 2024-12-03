import { format } from "date-fns";

import { axiosRequest } from "@api/lib/axios";

import {
	GET_LESSON_LIST_URL,
	GET_LESSON_URL,
	UPDATE_LESSON_URL,
	DELETE_LESSON_URL,
	CREATE_PERIOD_URL,
	GET_PERIOD_LIST_URL,
	CREATE_MASTER_LESSON_URL,
	GET_MASTER_LESSON_LIST,
	GET_MASTER_LESSON_URL,
	UPDATE_MASTER_LESSON_URL,
	DELETE_MASTER_LESSON_URL,
} from "./constants";

import {
	lessonDetailsSuccessResponseSchema,
	lessonListSuccessResponseSchema,
	updateLessonStudentListSuccessResponseSchema,
	updateLessonSuccessResponseSchema,
	deleteLessonSuccessResponseSchema,
	createPeriodSuccessResponseSchema,
	periodListSuccessResponseSchema,
	createMasterLessonSuccessResponseSchema,
	masterLessonListSuccessResponseSchema,
	masterLessonDetailsSuccessResponseSchema,
	updateMasterLessonSuccessResponseSchema,
	deleteMasterLessonSuccessResponseSchema,
} from "./schemas";
import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetLessons,
	GetLessonDetails,
	UpdateLessonStudentList,
	UpdateLesson,
	DeleteLesson,
	CreatePeriod,
	GetPeriods,
	CreateMasterLesson,
	GetMasterLessons,
	GetMasterLessonDetails,
	UpdateMasterLesson,
	DeleteMasterLesson,
} from "./types";

export async function getLessons({ signal, searchParams }: GetLessons) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const lessons = await axiosRequest({
		signal,
		url: GET_LESSON_LIST_URL(queryString),
	});

	if (!lessons) {
		return null;
	}

	const validatedLessons = lessonListSuccessResponseSchema.safeParse(lessons);
	const validatedError = errorSchema.safeParse(lessons);

	if (validatedLessons.success) {
		return validatedLessons.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedLessons.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getLessonDetails({ signal, payload }: GetLessonDetails) {
	const { id } = payload;

	const lesson = await axiosRequest({
		signal,
		url: GET_LESSON_URL(id),
	});

	if (!lesson) {
		return null;
	}

	const validatedLessonDetails =
		lessonDetailsSuccessResponseSchema.safeParse(lesson);
	const validatedError = errorSchema.safeParse(lesson);

	if (validatedLessonDetails.success) {
		return validatedLessonDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedLessonDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateLessonStudentList({
	students,
	lessonId,
}: UpdateLessonStudentList) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "patch",
		url: UPDATE_LESSON_URL(lessonId),
		body: students,
	});

	const validatedLesson =
		updateLessonStudentListSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedLesson.success) {
		return validatedLesson.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedLesson.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateLesson({ lesson, lessonId }: UpdateLesson) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "patch",
		url: UPDATE_LESSON_URL(lessonId),
		body: lesson,
	});

	const validatedLesson = updateLessonSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedLesson.success) {
		return validatedLesson.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedLesson.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteLesson({ lessonId }: DeleteLesson) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_LESSON_URL(lessonId),
	});

	const validatedResult = deleteLessonSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createPeriod({ period }: CreatePeriod) {
	const { periodDates } = period;

	const [startDate, endDate] = periodDates;

	const formattedPeriod = {
		start_date: format(startDate, "yyyy-MM-dd"),
		end_date: format(endDate, "yyyy-MM-dd"),
		...period,
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_PERIOD_URL(),
		body: formattedPeriod,
	});

	const validatedPeriod = createPeriodSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedPeriod.success) {
		return validatedPeriod.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedPeriod.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getPeriods({ signal, searchParams }: GetPeriods) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const periods = await axiosRequest({
		signal,
		url: GET_PERIOD_LIST_URL(queryString),
	});

	if (!periods) {
		return null;
	}

	const validatedLessons = periodListSuccessResponseSchema.safeParse(periods);
	const validatedError = errorSchema.safeParse(periods);

	if (validatedLessons.success) {
		return validatedLessons.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedLessons.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createMasterLesson({ lesson }: CreateMasterLesson) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_MASTER_LESSON_URL(),
		body: lesson,
	});

	const validatedMasterLesson =
		createMasterLessonSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedMasterLesson.success) {
		return validatedMasterLesson.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMasterLesson.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getMasterLessons({
	signal,
	searchParams,
}: GetMasterLessons) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const masterLessons = await axiosRequest({
		signal,
		url: GET_MASTER_LESSON_LIST(queryString),
	});

	if (!masterLessons) {
		return null;
	}

	const validatedMasterLessons =
		masterLessonListSuccessResponseSchema.safeParse(masterLessons);
	const validatedError = errorSchema.safeParse(masterLessons);

	if (validatedMasterLessons.success) {
		return validatedMasterLessons.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMasterLessons.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getMasterLessonDetails({
	signal,
	payload,
}: GetMasterLessonDetails) {
	const { id } = payload;

	const masterLesson = await axiosRequest({
		signal,
		url: GET_MASTER_LESSON_URL(id),
	});

	if (!masterLesson) {
		return null;
	}

	const validatedMasterLessonDetails =
		masterLessonDetailsSuccessResponseSchema.safeParse(masterLesson);
	const validatedError = errorSchema.safeParse(masterLesson);

	if (validatedMasterLessonDetails.success) {
		return validatedMasterLessonDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMasterLessonDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateMasterLesson({
	masterLesson,
	masterLessonId,
}: UpdateMasterLesson) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "put",
		url: UPDATE_MASTER_LESSON_URL(masterLessonId),
		body: masterLesson,
	});

	const validatedMasterLesson =
		updateMasterLessonSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedMasterLesson.success) {
		return validatedMasterLesson.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMasterLesson.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteMasterLesson({
	masterLessonId,
}: DeleteMasterLesson) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_MASTER_LESSON_URL(masterLessonId),
	});

	const validatedResult =
		deleteMasterLessonSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}
