import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

import { router } from "@routes/index";

import {
	unauthorizedErrorHandler,
	serverErrorHandler,
	notFoundErrorHandler,
} from "./handlers";
import { getRouterError } from "./router-error-generator";

import { errorSchema } from "@api/schemas";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			throwOnError: (error: unknown) => {
				const validatedError = errorSchema.safeParse(error);

				if (!validatedError.success) {
					return true;
				}

				const { status } = validatedError.data;

				switch (status) {
					case 404:
					case 500: {
						return true;
					}
				}
				return false;
			},
			retry: (failureCount, error) => {
				unauthorizedErrorHandler(error, () => false);

				const defaultRetry = new QueryClient().getDefaultOptions().queries
					?.retry;

				return Number.isSafeInteger(defaultRetry) && defaultRetry
					? failureCount < (+defaultRetry ?? 0)
					: false;
			},
		},
	},
	queryCache: new QueryCache({
		onError(error) {
			serverErrorHandler(error, () => {
				throw getRouterError(500, "Internal Server Error!");
			});
			notFoundErrorHandler(error, () => {
				throw getRouterError(404, "Not Found!");
			});
			unauthorizedErrorHandler(error, () => router.navigate("/signin"));
		},
	}),
	mutationCache: new MutationCache({
		onError(error) {
			serverErrorHandler(error, () => {
				throw getRouterError(500, "Internal Server Error!");
			});
			notFoundErrorHandler(error, () => {
				throw getRouterError(404, "Not Found!");
			});
			unauthorizedErrorHandler(error, () => router.navigate("/signin"));
		},
	}),
});
