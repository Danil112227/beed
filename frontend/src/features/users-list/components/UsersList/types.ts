import { UserShort } from "@api/services/users";

export interface UsersListProps {
	isOnlyDetach?: boolean;
	isDisableActions?: boolean;
	users: UserShort[];
}