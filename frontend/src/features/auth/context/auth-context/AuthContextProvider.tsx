import { useState, useCallback, useEffect } from "react";

import { useMutation } from "@tanstack/react-query";

import { router } from "@routes/index";

import { authContext } from "./auth-context";

import { useAuthQuery, UserAuthDetails, logoutUser } from "@api/services/auth";

import { deleteCookie } from "@utils/cookies";

import {
	SESSION_TOKEN_KEY,
	CSRF_TOKEN_KEY,
} from "@features/auth/data/constants";

import { Nullable } from "@utils/types";
import { AuthContextProviderProps } from "./types";

function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState<Nullable<UserAuthDetails>>(null);

	const isAuthenticated = !!user;

	const { data: userAuthDetails, isLoading: isAuthLoading } = useAuthQuery({
		isEnabled: true,
		queryType: "self-user-data",
		queryKey: ["self-user-data"],
		retry: false,
	});

	const { mutate: logoutUserMutation } = useMutation({
		mutationFn: logoutUser,
	});

	useEffect(() => {
		if (userAuthDetails) {
			setUser(userAuthDetails);
		}
	}, [userAuthDetails]);

	const loginHandler = useCallback((user: UserAuthDetails) => {
		setUser(user);
	}, []);

	const logoutHandler = useCallback(() => {
		logoutUserMutation(undefined, {
			onSuccess() {
				deleteCookie(SESSION_TOKEN_KEY);
				deleteCookie(CSRF_TOKEN_KEY);
				setUser(null);
				router.navigate("/signin");
			},
		});
	}, [logoutUserMutation]);

	return (
		<authContext.Provider
			value={{
				user,
				isAuthenticated,
				isAuthLoading,
				onLogout: logoutHandler,
				onLogin: loginHandler,
			}}
		>
			{children}
		</authContext.Provider>
	);
}

export { AuthContextProvider };
