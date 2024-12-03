import { useAuth } from "@features/auth";
import { useRoleAccess } from "@features/role-access/hooks/useRoleAccess";

import { RoleGuardProps } from "./types";

function RoleGuard({ children, roles, permissions }: RoleGuardProps) {
	const { getPermission } = useRoleAccess();

	const { isAuthLoading, isAuthenticated } = useAuth({});

	const hasPermission = getPermission(roles, permissions);

	if (isAuthLoading || !isAuthenticated || !hasPermission) {
		return null;
	}

	return <>{children}</>;
}

export { RoleGuard };
