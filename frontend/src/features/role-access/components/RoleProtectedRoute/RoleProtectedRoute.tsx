import { Navigate } from "react-router-dom";

import { useRoleAccess } from "@features/role-access/hooks/useRoleAccess";
import { useAuth } from "@features/auth";

import { RoleProtectedRouteProps } from "./types";

function RoleProtectedRoute({
	replace,
	redirectToPath,
	roles,
	permissions,
	children,
	isDisableRedirection,
}: RoleProtectedRouteProps) {
	const { getPermission } = useRoleAccess();

	const { isAuthLoading, isAuthenticated } = useAuth({});

	const hasPermission = getPermission(roles, permissions);

	if (isAuthLoading || !isAuthenticated) {
		return null;
	}

	if (
		!hasPermission &&
		!isAuthLoading &&
		isAuthenticated &&
		isDisableRedirection
	) {
		throw { status: 404, statusText: "Not Found!", data: {}, internal: false };
	}

	if (!hasPermission && !isAuthLoading && isAuthenticated) {
		return <Navigate to={redirectToPath} replace={replace} />;
	}

	return children;
}

export { RoleProtectedRoute };
