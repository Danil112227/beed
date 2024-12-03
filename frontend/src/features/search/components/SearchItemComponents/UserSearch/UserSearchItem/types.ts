import { UserTypesEnum } from "@api/services/users";

export interface UserSearchItemProps {
	id: number;
	firstName: string;
	lastName: string;
	patronymic?: string;
	type: UserTypesEnum;
}
