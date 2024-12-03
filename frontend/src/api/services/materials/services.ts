import { serialize } from "object-to-formdata";

import { axiosRequest } from "@api/lib/axios";

import {
	GET_MATERIAL_LIST_URL,
	CREATE_MATERIAL_URL,
	UPDATE_MATERIAL_URL,
	DELETE_MATERIAL_URL,
	GET_MATERIAL_URL,
	GET_LESSON_MATERIAL_LIST_URL,
	GET_LESSON_MATERIAL_URL,
	CREATE_LESSON_MATERIAL_URL,
	DELETE_LESSON_MATERIAL_URL,
	UPDATE_LESSON_MATERIAL_URL,
} from "./constants";

import {
	materialsListSuccessResponseSchema,
	createMaterialSuccessResponseSchema,
	updateMaterialSuccessResponseSchema,
	deleteMaterialSuccessResponseSchema,
	materialDetailsSuccessResponseSchema,
	lessonMaterialsListSuccessResponseSchema,
	lessonMaterialDetailsSuccessResponseSchema,
	createLessonMaterialSuccessResponseSchema,
	updateLessonMaterialSuccessResponseSchema,
} from "./schemas";
import { errorSchema, validationErrorSchema } from "@api/schemas";

import { getStringFormattedQueryParams } from "@api/helpers/params";

import {
	GetMaterialsParams,
	CreateMaterial,
	UpdateMaterial,
	DeleteMaterial,
	GetMaterialDetailsParams,
} from "./types";

export async function getMaterials({
	signal,
	searchParams,
	isLesson,
}: GetMaterialsParams) {
	const queryString = getStringFormattedQueryParams(searchParams);

	let url = GET_MATERIAL_LIST_URL(queryString);

	if (isLesson) {
		url = GET_LESSON_MATERIAL_LIST_URL(queryString);
	}

	const materials = await axiosRequest({
		signal,
		url,
	});

	if (!materials) {
		return null;
	}

	const validatedMaterials =
		materialsListSuccessResponseSchema.safeParse(materials);
	const validatedLessonMaterials =
		lessonMaterialsListSuccessResponseSchema.safeParse(materials);
	const validatedError = errorSchema.safeParse(materials);

	if (!isLesson && validatedMaterials.success) {
		return validatedMaterials.data;
	} else if (isLesson && validatedLessonMaterials.success) {
		return validatedLessonMaterials.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMaterials.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}

export async function createMaterial({ material }: CreateMaterial) {
	const { documents, lesson } = material;

	const formData = serialize(
		{
			...material,
			documents: documents?.map((document) => document.id),
		},
		{ noAttributesWithArrayNotation: true },
	);

	const result = await axiosRequest({
		applyContentType: false,
		method: "post",
		url: lesson ? CREATE_LESSON_MATERIAL_URL() : CREATE_MATERIAL_URL(),
		body: formData,
	});

	const validatedMaterial =
		createMaterialSuccessResponseSchema.safeParse(result);
	const validatedLessonMaterial =
		createLessonMaterialSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedMaterial.success && !lesson) {
		return validatedMaterial.data;
	} else if (validatedLessonMaterial.success && lesson) {
		return validatedLessonMaterial.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMaterial.error?.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function updateMaterial({ materialId, material }: UpdateMaterial) {
	const { documents, lesson } = material;

	const formData = serialize(
		{
			...material,
			documents: documents?.map((document) => document.id),
		},
		{ noAttributesWithArrayNotation: true },
	);

	const result = await axiosRequest({
		applyContentType: false,
		method: "put",
		url: lesson
			? UPDATE_LESSON_MATERIAL_URL(materialId)
			: UPDATE_MATERIAL_URL(materialId),
		body: formData,
	});

	const validatedMaterial =
		updateMaterialSuccessResponseSchema.safeParse(result);
	const validatedLessonMaterial =
		updateLessonMaterialSuccessResponseSchema.safeParse(result);
	const validatedValidationError = validationErrorSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedMaterial.success && !lesson) {
		return validatedMaterial.data;
	} else if (validatedLessonMaterial.success && lesson) {
		return validatedLessonMaterial.data;
	} else if (validatedValidationError.success) {
		throw validatedValidationError.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMaterial.error?.issues);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function deleteMaterial({
	materialId,
	isLessonOperation,
}: DeleteMaterial) {
	const result = await axiosRequest({
		applyContentType: false,
		method: "delete",
		url: isLessonOperation
			? DELETE_LESSON_MATERIAL_URL(materialId)
			: DELETE_MATERIAL_URL(materialId),
	});

	const validatedResult = deleteMaterialSuccessResponseSchema.safeParse(result);
	const validatedError = errorSchema.safeParse(result);

	if (validatedResult.success) {
		return validatedResult.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedResult.error.errors);
	throw { title: "Error!", message: "Something went wrong!" };
}

export async function getMaterialDetails({
	signal,
	payload,
	isLesson,
}: GetMaterialDetailsParams) {
	const { id } = payload;

	let url = GET_MATERIAL_URL(id);

	if (isLesson) {
		url = GET_LESSON_MATERIAL_URL(id);
	}

	const material = await axiosRequest({
		signal,
		url,
	});

	if (!material) {
		return null;
	}

	const validatedMaterialDetails =
		materialDetailsSuccessResponseSchema.safeParse(material);
	const validatedLessonMaterialDetails =
		lessonMaterialDetailsSuccessResponseSchema.safeParse(material);
	const validatedError = errorSchema.safeParse(material);

	if (validatedMaterialDetails.success) {
		return validatedMaterialDetails.data;
	} else if (validatedLessonMaterialDetails.success) {
		return validatedLessonMaterialDetails.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	console.error(validatedMaterialDetails.error?.issues);

	throw { title: "Error!", message: "Something went wrong!" };
}
