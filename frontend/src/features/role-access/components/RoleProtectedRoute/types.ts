import { UserTypesEnum } from "@api/services/users";

export interface RoleProtectedRouteProps {
	replace: boolean;
	redirectToPath: string;
	roles: UserTypesEnum[];
	permissions: string[];
	children: JSX.Element;
	isDisableRedirection: boolean;
}
