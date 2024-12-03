export { useMaterialsQuery } from "./useMaterialsQuery";

export { createMaterial, updateMaterial, deleteMaterial } from "./services";

export type {
	UserMaterial,
	DocumentMaterial,
	CreateMaterialSuccessResponse,
	CreateMaterialValidationError,
	CreateMaterial,
	UpdateMaterialSuccessResponse,
	UpdateMaterialValidationError,
	UpdateMaterial,
	CreateLessonMaterialSuccessResponse,
	UpdateLessonMaterialSuccessResponse,
} from "./types";
