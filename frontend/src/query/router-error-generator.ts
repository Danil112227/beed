export function getRouterError(status: number, statusText: string) {
	return { status, statusText, data: {}, internal: false };
}
