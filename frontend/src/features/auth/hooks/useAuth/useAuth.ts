import { useContext, useEffect } from "react";

import { authContext } from "@features/auth/context/auth-context/auth-context";

import { UseAuthProps } from "./types";

function useAuth({ isLogout }: UseAuthProps) {
	const { user, isAuthenticated, isAuthLoading, onLogout, onLogin } =
		useContext(authContext);

	useEffect(() => {
		if (!isLogout) {
			return;
		}

		onLogout();
	}, [onLogout, isLogout]);

	return { user, isAuthenticated, isAuthLoading, onLogout, onLogin };
}

export { useAuth };
