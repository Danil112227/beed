import { z } from "zod";

import { errorSchema } from "./schemas";

export interface AxiosParams {
	applyContentType?: boolean;
	signal?: AbortSignal;
	method?: string;
	url: string;
	body?: unknown;
	headers?: Record<string, string>;
}

export interface ValidationError<T> {
	status: number;
	data: T;
}

export type Error = z.infer<typeof errorSchema>;
