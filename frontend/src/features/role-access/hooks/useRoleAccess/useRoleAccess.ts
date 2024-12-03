import { useCallback } from "react";

import { UserTypesEnum } from "@api/services/users";

import { useAuth } from "@features/auth";

export function useRoleAccess() {
	const { user } = useAuth({});

	const getPermission = useCallback(
		(roles: UserTypesEnum[], permissions: string[]) => {
			if (!user) {
				return false;
			}

			const { type, permissions: userPermissions } = user;

			return (
				(roles.includes(type) || roles.length === 0) &&
				(permissions.some(
					(permission) =>
						Object.entries(userPermissions).find(
							([key]) => key === permission,
						)?.[1],
				) ||
					permissions.length === 0)
			);
		},
		[user],
	);

	return { getPermission };
}
