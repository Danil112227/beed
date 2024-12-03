import { serialize } from "object-to-formdata";

import { axiosRequest } from "@api/lib/axios";

import { UPLOAD_DOCUMENTS_API } from "./constants";

import { uploadDocumentsSuccessResponseSchema } from "./schemas";
import { errorSchema } from "@api/schemas";

import { UploadDocuments } from "./types";

export async function uploadDocuments({ file }: UploadDocuments) {
	const formData = serialize({ file });

	const documents = await axiosRequest({
		applyContentType: false,
		url: UPLOAD_DOCUMENTS_API(),
		method: "post",
		body: formData,
	});

	const validatedLogoutUser =
		uploadDocumentsSuccessResponseSchema.safeParse(documents);
	const validatedError = errorSchema.safeParse(documents);

	if (validatedLogoutUser.success) {
		return validatedLogoutUser.data;
	} else if (validatedError.success) {
		throw validatedError.data;
	}

	throw { title: "Error!", message: "Something went wrong!" };
}
