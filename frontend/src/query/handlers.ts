import { errorSchema } from "@api/schemas";

export const unauthorizedErrorHandler = <T>(
	error: Error,
	callback: () => T,
) => {
	const validatedError = errorSchema.safeParse(error);

	if (validatedError.success) {
		const { status } = validatedError.data;

		if (status === 401) {
			return callback();
		}
	}
};

export const serverErrorHandler = <T>(error: Error, callback: () => T) => {
	const validatedError = errorSchema.safeParse(error);

	if (validatedError.success) {
		const { status } = validatedError.data;

		if (status === 500) {
			return callback();
		}
	}
};

export const notFoundErrorHandler = <T>(error: Error, callback: () => T) => {
	const validatedError = errorSchema.safeParse(error);

	if (validatedError.success) {
		const { status } = validatedError.data;

		if (status === 404) {
			return callback();
		}
	}
};
