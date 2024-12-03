import { UserTypesEnum, UserShort } from "@api/services/users";

import { SelectValue } from "../hooks/useSelect";

export const getSelectFormattedUserTypesValues =
	(): SelectValue<UserTypesEnum>[] => {
		return Object.entries(UserTypesEnum)
			.filter(([_, value]) => typeof value === "number")
			.map(([key, value]) => {
				return {
					value: value as UserTypesEnum,
					label: key[0] + key.slice(1).toLowerCase(),
				};
			});
	};

export const getSelectFormattedUserValues = (
	values?: UserShort[],
): SelectValue<number>[] => {
	if (!values) {
		return [];
	}

	return values.map((user) => {
		return {
			value: user.id,
			label: `${user.last_name} ${user.first_name}`,
		};
	});
};
