export { useSchoolsQuery } from "./useSchoolsQuery";

export { deleteSchool, createSchool, updateSchool } from "./services";

export { SCHOOLS_API, PeriodTypesEnum } from "./constants";

export { schoolSchema } from "./schemas";

export type {
	School,
	SchoolsQueryType,
	SchoolsListQueryType,
	CreateSchoolValidationError,
	CreateSchool,
	CreateSchoolSuccessResponse,
	UpdateSchool,
	UpdateSchoolSuccessResponse,
	UpdateSchoolValidationError,
	Period,
} from "./types";
