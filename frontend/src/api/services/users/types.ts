import { z } from "zod";

import { CreateUserFields } from "@features/user-create";

import {
	usersListExtendedSuccessResponseSchema,
	usersListShortSuccessResponseSchema,
	userDetailsExtendedSuccessResponseSchema,
	userDetailsShortSuccessResponseSchema,
	userShortSchema,
	userSchema,
	gradeShortSchema,
	disciplineShortSchema,
	createUserSuccessResponseSchema,
	updateUserSuccessResponseSchema,
} from "./schemas";

import { ValidationError } from "@api/types";
import { userAuthSuccessResponseSchema } from "@api/services/auth";
// import { GradesListResponse } from "../grade/types";
// import { SchoolListResponse } from "../schools/types";

export interface UsersQueryType
	extends UsersListQueryType,
		UserDetailsQueryType {}

export interface GetUsersParams {
	isExtendedVersion: boolean;
	signal?: AbortSignal;
	searchParams?: Record<string, unknown>;
}

export interface UsersListQueryType {
	"users-extended": UsersListExtendedResponse;
	"users-short": UsersListShortResponse;
	// grades: GradesListResponse;
	// schools: SchoolListResponse;
}

export interface UsersPayload {
	"users-details-extended": GetUserDetailsPayload;
	"users-details-short": GetUserDetailsPayload;
	"users-extended": undefined;
	"users-short": undefined;
}

export interface UseUsersQueryParams<T extends keyof UsersQueryType> {
	isEnabled: boolean;
	isPaginationEnabled?: boolean;
	queryType: T;
	queryKey: (string | Record<string, unknown>)[];
	searchParams?: Record<string, unknown>;
	payload?: UsersPayload[T];
}

export type UsersListExtendedResponse = z.infer<
	typeof usersListExtendedSuccessResponseSchema
>;

export type UsersListShortResponse = z.infer<
	typeof usersListShortSuccessResponseSchema
>;

export interface GetUserDetailsParams {
	isExtendedVersion: boolean;
	signal?: AbortSignal;
	payload: GetUserDetailsPayload;
}

export interface GetUserDetailsPayload {
	id: string;
}

export interface UserDetailsQueryType {
	"users-details-extended": UserDetailsExtendedResponse;
	"users-details-short": UserDetailsShortResponse;
}

export type UserDetailsExtendedResponse = z.infer<
	typeof userDetailsExtendedSuccessResponseSchema
>;

export type UserDetailsShortResponse = z.infer<
	typeof userDetailsShortSuccessResponseSchema
>;

export type UserShort = z.infer<typeof userShortSchema>;

export type UserExtended = z.infer<typeof userSchema>;

export interface CreateUser {
	user: CreateUserFields;
}

export type CreateUserValidationError = ValidationError<
	Record<
		keyof Omit<
			UserExtended,
			| "id"
			| "disciplines"
			| "my_grades"
			| "user_timezone_text"
			| "can_edit"
			| "can_delete"
			| "can_super_login"
		>,
		string[]
	>
>;

export type CreateUserSuccessResponse = z.infer<
	typeof createUserSuccessResponseSchema
>;

export interface UpdateUser {
	id: string;
	user: CreateUserFields;
}

export type UpdateUserValidationError = ValidationError<
	Record<
		keyof Omit<
			UserExtended,
			| "id"
			| "disciplines"
			| "my_grades"
			| "user_timezone_text"
			| "can_super_login"
			| "can_edit"
			| "can_delete"
		>,
		string[]
	>
>;

export type UpdateUserSuccessResponse = z.infer<
	typeof updateUserSuccessResponseSchema
>;

export interface DeleteUser {
	userId: string;
}

export type Grade = z.infer<typeof gradeShortSchema>;

export type DisciplineShort = z.infer<typeof disciplineShortSchema>;

export interface ResetPassword {
	username: string;
}

export interface SuperLogin {
	username: string;
}

export type SuperLoginValidationError = ValidationError<{ error: string }>;

export type UserAuthResponse = z.infer<typeof userAuthSuccessResponseSchema>;
