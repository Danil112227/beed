import { serialize } from "object-to-formdata";
import { format } from "date-fns";

import { axiosRequest } from "@api/lib/axios";

import {
	GET_HOMEWORK_LIST_URL,
	GET_HOMEWORK_URL,
	DELETE_HOMEWORK_URL,
	CREATE_HOMEWORK_URL,
	UPDATE_HOMEWORK_URL,
	GET_HOMEWORK_STUDENT_ANSWER_LIST_URL,
	CREATE_HOMEWORK_STUDENT_ANSWER_URL,
	UPDATE_HOMEWORK_STUDENT_ANSWER_URL,
	GET_HOMEWORK_TEACHER_ANSWER_LIST_URL,
	CREATE_HOMEWORK_TEACHER_ANSWER_URL,
	UPDATE_HOMEWORK_TEACHER_ANSWER_URL,
} from "./constants";

import {
	homeworkListSuccessResponseSchema,
	homeworkDetailsSuccessResponseSchema,
	deleteHomeworkSuccessResponseSchema,
	createHomeworkSuccessResponseSchema,
	updateHomeworkSuccessResponseSchema,
	homeworkStudentAnswerListSuccessResponseSchema,
	createHomeworkStudentAnswerSuccessResponseSchema,
	updateHomeworkStudentAnswerSuccessResponseSchema,
	homeworkTeacherAnswerListSuccessResponseSchema,
	createHomeworkTeacherAnswerSuccessResponseSchema,
	updateHomeworkTeacherAnswerSuccessResponseSchema,
} from "./schemas";

import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetHomeworksParams,
	GetMaterialDetailsParams,
	DeleteHomework,
	CreateHomework,
	UpdateHomework,
	GetHomeworkStudentAnswersParams,
	CreateHomeworkStudentAnswer,
	UpdateHomeworkStudentAnswer,
	GetHomeworkTeacherAnswersParams,
	CreateHomeworkTeacherAnswer,
	UpdateHomeworkTeacherAnswer,
} from "./types";

export async function getHomeworks({
	signal,
	searchParams,
}: GetHomeworksParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const homeworks = await axiosRequest({
		signal,
		url: GET_HOMEWORK_LIST_URL(queryString),
	});

	if (!homeworks) {
		return null;
	}

	const validatedHomeworks =
		homeworkListSuccessResponseSchema.safeParse(homeworks);
	const validatedError = errorSchema.safeParse(homeworks);

	if (validatedHomeworks.success) {
		return validatedHomeworks.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworks.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getHomeworkDetails({
	signal,
	payload,
	searchParams,
}: GetMaterialDetailsParams) {
	const { id } = payload;

	const queryString = getStringFormattedQueryParams(searchParams);

	const homework = await axiosRequest({
		signal,
		url: GET_HOMEWORK_URL(id, queryString),
	});

	if (!homework) {
		return null;
	}

	const validatedHomeworkDetails =
		homeworkDetailsSuccessResponseSchema.safeParse(homework);
	const validatedError = errorSchema.safeParse(homework);

	if (validatedHomeworkDetails.success) {
		return validatedHomeworkDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworkDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteHomework({ homeworkId }: DeleteHomework) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_HOMEWORK_URL(homeworkId),
	});

	const validatedResult = deleteHomeworkSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createHomework({ homework }: CreateHomework) {
	const { documents, deadline } = homework;

	const formattedHomework = {
		...homework,
		deadline: format(deadline, "yyyy-MM-dd"),
		documents: documents?.map((document) => document.id),
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_HOMEWORK_URL(),
		body: formattedHomework,
	});

	const validatedHomework =
		createHomeworkSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedHomework.success) {
		return validatedHomework.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomework.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateHomework({ homework, homeworkId }: UpdateHomework) {
	const { documents, deadline } = homework;

	const formData = serialize(
		{
			...homework,
			deadline: format(deadline, "yyyy-MM-dd"),
			documents: documents?.map((document) => document.id),
		},
		{ noAttributesWithArrayNotation: true },
	);

	const result = await axiosRequest({
		applyContentType: false,
		method: "put",
		url: UPDATE_HOMEWORK_URL(homeworkId),
		body: formData,
	});

	const validatedHomework =
		updateHomeworkSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedHomework.success) {
		return validatedHomework.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomework.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getHomeworkStudentAnswers({
	signal,
	searchParams,
}: GetHomeworkStudentAnswersParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const homeworkStudentAnswers = await axiosRequest({
		signal,
		url: GET_HOMEWORK_STUDENT_ANSWER_LIST_URL(queryString),
	});

	if (!homeworkStudentAnswers) {
		return null;
	}

	const validatedHomeworkStudentAnswers =
		homeworkStudentAnswerListSuccessResponseSchema.safeParse(
			homeworkStudentAnswers,
		);
	const validatedError = errorSchema.safeParse(homeworkStudentAnswers);

	if (validatedHomeworkStudentAnswers.success) {
		return validatedHomeworkStudentAnswers.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworkStudentAnswers.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createHomeworkStudentAnswer({
	answer,
	userId,
}: CreateHomeworkStudentAnswer) {
	const { documents } = answer;

	const formattedHomeworkStudentAnswer = {
		...answer,
		documents: documents?.map((document) => document.id),
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_HOMEWORK_STUDENT_ANSWER_URL(userId),
		body: formattedHomeworkStudentAnswer,
	});

	const validatedHomeworStudentAnswer =
		createHomeworkStudentAnswerSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedHomeworStudentAnswer.success) {
		return validatedHomeworStudentAnswer.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworStudentAnswer.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateHomeworkStudentAnswer({
	answer,
	answerId,
	userId,
}: UpdateHomeworkStudentAnswer) {
	const { documents } = answer;

	const formattedHomeworkStudentAnswer = {
		...answer,
		documents: documents?.map((document) => document.id),
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "put",
		url: UPDATE_HOMEWORK_STUDENT_ANSWER_URL(answerId, userId),
		body: formattedHomeworkStudentAnswer,
	});

	const validatedHomeworkStudentAnswer =
		updateHomeworkStudentAnswerSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedHomeworkStudentAnswer.success) {
		return validatedHomeworkStudentAnswer.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworkStudentAnswer.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getHomeworkTeacherAnswers({
	signal,
	searchParams,
}: GetHomeworkTeacherAnswersParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const homeworkTeacherAnswers = await axiosRequest({
		signal,
		url: GET_HOMEWORK_TEACHER_ANSWER_LIST_URL(queryString),
	});

	if (!homeworkTeacherAnswers) {
		return null;
	}

	const validatedHomeworkTeacherAnswers =
		homeworkTeacherAnswerListSuccessResponseSchema.safeParse(
			homeworkTeacherAnswers,
		);
	const validatedError = errorSchema.safeParse(homeworkTeacherAnswers);

	if (validatedHomeworkTeacherAnswers.success) {
		return validatedHomeworkTeacherAnswers.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworkTeacherAnswers.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createHomeworkTeacherAnswer({
	answer,
}: CreateHomeworkTeacherAnswer) {
	const { documents } = answer;

	const formattedHomeworkTeacherAnswer = {
		...answer,

		documents: documents?.map((document) => document.id),
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_HOMEWORK_TEACHER_ANSWER_URL(),
		body: formattedHomeworkTeacherAnswer,
	});

	const validatedHomeworTeacherAnswer =
		createHomeworkTeacherAnswerSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedHomeworTeacherAnswer.success) {
		return validatedHomeworTeacherAnswer.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworTeacherAnswer.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateHomeworkTeacherAnswer({
	answer,
	answerId,
}: UpdateHomeworkTeacherAnswer) {
	const { documents } = answer;

	const formattedHomeworkTeacherAnswer = {
		...answer,
		documents: documents?.map((document) => document.id),
	};

	const result = await axiosRequest({
		applyContentType: true,
		method: "put",
		url: UPDATE_HOMEWORK_TEACHER_ANSWER_URL(answerId),
		body: formattedHomeworkTeacherAnswer,
	});

	const validatedHomeworkTeacherAnswer =
		updateHomeworkTeacherAnswerSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedHomeworkTeacherAnswer.success) {
		return validatedHomeworkTeacherAnswer.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedHomeworkTeacherAnswer.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}
