import { BEED_BASE_URL } from "@api/constants";

const MATERIALS_API = "/api/materials";

export const GET_MATERIAL_LIST_URL = (query: string) =>
	BEED_BASE_URL + MATERIALS_API + "/materials" + query;
export const CREATE_MATERIAL_URL = () =>
	BEED_BASE_URL + MATERIALS_API + "/materials/";
export const UPDATE_MATERIAL_URL = (materialId: string) =>
	BEED_BASE_URL + MATERIALS_API + "/materials/" + materialId + "/";
export const DELETE_MATERIAL_URL = (materialId: string) =>
	BEED_BASE_URL + MATERIALS_API + "/materials/" + materialId + "/";
export const GET_MATERIAL_URL = (materialId: string) =>
	BEED_BASE_URL + MATERIALS_API + "/materials/" + materialId;


export const GET_LESSON_MATERIAL_LIST_URL = (query: string) =>
	BEED_BASE_URL + MATERIALS_API + "/lesson_materials" + query;
export const CREATE_LESSON_MATERIAL_URL = () =>
	BEED_BASE_URL + MATERIALS_API + "/lesson_materials/";
export const UPDATE_LESSON_MATERIAL_URL = (materialId: string) =>
	BEED_BASE_URL + MATERIALS_API + "/lesson_materials/" + materialId + "/";
export const DELETE_LESSON_MATERIAL_URL = (materialId: string) =>
	BEED_BASE_URL + MATERIALS_API + "/lesson_materials/" + materialId + "/";
export const GET_LESSON_MATERIAL_URL = (materialId: string) =>
	BEED_BASE_URL + MATERIALS_API + "/lesson_materials/" + materialId;
