import axios, { isAxiosError } from "axios";

import { CSRF_TOKEN_KEY } from "@features/auth";

import { getCookie } from "@utils/cookies";

import { AxiosParams } from "api/types";

export async function axiosRequest<T = unknown>({
	applyContentType = true,
	signal,
	method = "get",
	url,
	body,
	headers = {},
}: AxiosParams) {
	const csrf = getCookie(CSRF_TOKEN_KEY);

	try {
		const { data } = await axios<T>({
			signal,
			method,
			url,
			headers: {
				"Content-Type": applyContentType ? "application/json" : undefined,
				Accept: "application/json",
				"X-CSRFToken": csrf,
				...headers,
			},
			data: body,
		});

		return data;
	} catch (err) {
		if (!isAxiosError(err) || !err.response) {
			return;
		}

		const { data, status } = err.response;

		return {
			status,
			data,
		};
	}
}
