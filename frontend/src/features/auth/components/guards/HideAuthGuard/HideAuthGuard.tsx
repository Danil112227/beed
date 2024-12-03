import { useAuth } from "@features/auth/hooks/useAuth";

import { HideAuthGuardProps } from "./types";

function HideAuthGuard({ children }: HideAuthGuardProps) {
	const { isAuthenticated } = useAuth({});

	if (!isAuthenticated) {
		return null;
	}

	return <>{children}</>;
}

export { HideAuthGuard };
