export function getStringFormattedQueryParams(
	params?: Record<string, unknown>,
) {
	const searchParams = new URLSearchParams();

	if (!params) {
		return "";
	}

	const formattedRouteSearchParams = Object.entries(params);

	for (const [key, value] of formattedRouteSearchParams) {
		if (!value) {
			continue;
		}

		if (value instanceof Date) {
			searchParams.set(key, value.toISOString());
		} else if (typeof value === "string") {
			if (!value.length) continue;
			searchParams.set(key, value);
		} else {
			searchParams.set(key, JSON.stringify(value));
		}
	}

	if (!searchParams.size) {
		return "";
	}

	return "?" + searchParams.toString();
}
