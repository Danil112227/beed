import { createContext } from "react";

import { InitAuthContext } from "./types";

const initAuthContext: InitAuthContext = {
	user: null,
	isAuthenticated: false,
	isAuthLoading: false,
	onLogout: () => {},
	onLogin: () => {},
};

export const authContext = createContext(initAuthContext);
