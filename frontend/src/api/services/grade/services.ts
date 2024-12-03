import { axiosRequest } from "@api/lib/axios";

import {
	GET_GRADE_LIST_URL,
	DELETE_GRADE_URL,
	GET_GRADE_URL,
	CREATE_GRADE_URL,
	UPDATE_GRADE_URL,
} from "./constants";

import {
	gradesListSuccessResponseSchema,
	deleteGradeSuccessResponseSchema,
	createGradeSuccessResponseSchema,
	updateGradeSuccessResponseSchema,
	gradeDetailsSuccessResponseSchema,
	addGradeStudentsSuccessResponseSchema,
} from "./schemas";
import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetGradesParams,
	DeleteGrade,
	GetGradeDetailsParams,
	CreateGrade,
	UpdateGrade,
	AddGradeStudent,
	RemoveGradeStudent,
} from "./types";

export async function getGrades({ signal, searchParams }: GetGradesParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const grades = await axiosRequest({
		signal,
		url: GET_GRADE_LIST_URL(queryString),
	});

	if (!grades) {
		return null;
	}

	const validatedGrades = gradesListSuccessResponseSchema.safeParse(grades);
	const validatedError = errorSchema.safeParse(grades);

	if (validatedGrades.success) {
		return validatedGrades.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedGrades.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createGrade({ grade }: CreateGrade) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "post",
		url: CREATE_GRADE_URL(),
		body: grade,
	});

	const validatedGrade = createGradeSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedGrade.success) {
		return validatedGrade.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedGrade.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateGrade({ grade, gradeId }: UpdateGrade) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "put",
		url: UPDATE_GRADE_URL(gradeId),
		body: grade,
	});

	const validatedGrade = updateGradeSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedGrade.success) {
		return validatedGrade.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedGrade.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteGrade({ gradeId }: DeleteGrade) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_GRADE_URL(gradeId),
	});

	const validatedResult = deleteGradeSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getGradeDetails({
	signal,
	payload,
}: GetGradeDetailsParams) {
	const { id } = payload;

	const grade = await axiosRequest({
		signal,
		url: GET_GRADE_URL(id),
	});

	if (!grade) {
		return null;
	}

	const validatedGradeDetails =
		gradeDetailsSuccessResponseSchema.safeParse(grade);
	const validatedError = errorSchema.safeParse(grade);

	if (validatedGradeDetails.success) {
		return validatedGradeDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedGradeDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function addGradeStudent({ students, gradeId }: AddGradeStudent) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "patch",
		url: UPDATE_GRADE_URL(gradeId),
		body: students,
	});

	const validatedGrade =
		addGradeStudentsSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedGrade.success) {
		return validatedGrade.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedGrade.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function removeGradeStudent({
	students,
	gradeId,
}: RemoveGradeStudent) {
	const result = await axiosRequest({
		applyContentType: true,
		method: "patch",
		url: UPDATE_GRADE_URL(gradeId),
		body: students,
	});

	const validatedGrade =
		addGradeStudentsSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedGrade.success) {
		return validatedGrade.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedGrade.error.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}
