import { axiosRequest } from "@api/lib/axios";

import {
	GET_DISCIPLINE_LIST_URL,
	CREATE_DISCIPLINE_URL,
	DELETE_DISCIPLINE_URL,
} from "./constants";

import {
	disciplinesListSuccessResponseSchema,
	createDisciplineSuccessResponseSchema,
	deleteDisciplineSuccessResponseSchema,
} from "./schemas";
import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetDisciplinesParams,
	CreateDiscipline,
	DeleteDiscipline,
} from "./types";

export async function getDisciplines({
	signal,
	searchParams,
}: GetDisciplinesParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	const disciplines = await axiosRequest({
		signal,
		url: GET_DISCIPLINE_LIST_URL(queryString),
	});

	if (!disciplines) {
		return null;
	}

	const validatedDisciplines =
		disciplinesListSuccessResponseSchema.safeParse(disciplines);
	const validatedError = errorSchema.safeParse(disciplines);

	if (validatedDisciplines.success) {
		return validatedDisciplines.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedDisciplines.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createDiscipline({ discipline }: CreateDiscipline) {
	const { grades } = discipline;

	const formattedDiscripline = {
		...discipline,
		grades: [grades],
	};

	const result = await axiosRequest({
		applyContentType: false,
		method: "post",
		url: CREATE_DISCIPLINE_URL(),
		body: formattedDiscripline,
	});

	const validatedDiscipline =
		createDisciplineSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedDiscipline.success) {
		return validatedDiscipline.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedDiscipline.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteDiscipline({ disciplineId }: DeleteDiscipline) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: DELETE_DISCIPLINE_URL(disciplineId),
	});

	const validatedResult =
		deleteDisciplineSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}
