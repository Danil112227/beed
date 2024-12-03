import { UserTypesEnum } from "@api/services/users";

export function getInitPath(type: UserTypesEnum) {
	switch (type) {
		case UserTypesEnum.STUDENT:
			return "/student/timetable";
		case UserTypesEnum.PARENT:
			return "/student/timetable";
		case UserTypesEnum.TEACHER:
			return "/users";
		case UserTypesEnum.TUTOR:
			return "/student/timetable";
	}
}
