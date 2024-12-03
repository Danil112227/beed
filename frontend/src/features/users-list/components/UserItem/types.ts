import { UserShort } from "@api/services/users";

export interface UserItemProps {
	user: UserShort;
	isOnlyDetach?: boolean;
	isDisableActions?: boolean;
	isCheckboxVisible?: boolean;
	isCheckboxChecked?: boolean;
	onToggleCheckbox?: (studentId: number) => void;
}
