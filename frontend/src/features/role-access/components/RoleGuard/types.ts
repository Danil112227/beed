import { UserTypesEnum } from "@api/services/users";

export interface RoleGuardProps {
	roles: UserTypesEnum[];
	permissions: string[];
	children: JSX.Element;
}
