import { UserAuthDetails } from "@api/services/auth";

import { Nullable } from "@utils/types";

export interface InitAuthContext {
	user: Nullable<UserAuthDetails>;
	isAuthenticated: boolean;
	isAuthLoading: boolean;
	onLogout: () => void;
	onLogin: (user: UserAuthDetails) => void;
}

export interface AuthContextProviderProps {
	children: JSX.Element;
}

export interface LoginPayload {
	token: string;
}
