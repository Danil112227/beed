import { UserTypesEnum } from "@api/services/users";

export const USER_TYPES = {
	[UserTypesEnum.STUDENT]: "student",
	[UserTypesEnum.TEACHER]: "teacher",
	[UserTypesEnum.TUTOR]: "tutor",
	[UserTypesEnum.PARENT]: "parent",
};
