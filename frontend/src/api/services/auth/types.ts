import { z } from "zod";

import {
	userAuthSuccessResponseSchema,
	userSelfSuccessResponseSchema,
	userAuthDetailsSchema,
} from "./schemas";

import { ValidationError } from "@api/types";

export interface SuperAuthorizeUserParams {
	body: { user: string };
}

export interface AuthorizeUserParams {
	body: { username: string; password: string };
}

export interface GetSelfUserData {
	signal?: AbortSignal;
}

export interface AuthQueryType {
	"self-user-data": UserSelfResponse;
}

export interface AuthMutationType {
	login: UserAuthResponse;
}

export interface UseAuthMutationParams<T extends keyof AuthMutationType> {
	mutationType: T;
}

export interface UseAuthQueryParams<T extends keyof AuthQueryType> {
	isEnabled: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	retry: boolean;
}

export type UserAuthDetails = z.infer<typeof userAuthDetailsSchema>;

export type UserAuthResponse = z.infer<typeof userAuthSuccessResponseSchema>;

export type UserSelfResponse = z.infer<typeof userSelfSuccessResponseSchema>;

export type SignInValidationError = ValidationError<{ error: string }>;
