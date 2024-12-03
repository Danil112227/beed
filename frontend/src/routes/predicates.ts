import { Error } from "@api/types";

export function isQueryError(error: any): error is Error {
	return error !== null && typeof error.status === "number" && "data" in error;
}
