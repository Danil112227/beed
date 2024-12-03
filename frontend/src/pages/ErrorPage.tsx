import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { NotFoundPage } from "./NotFoundPage";
import { ServerErrorPage } from "./ServerErrorPage";
import { SomethingWentWrongPage } from "./SomethingWentWrongPage";

import { isQueryError } from "@routes/predicates";

function ErrorPage() {
	const error = useRouteError();

	if (isRouteErrorResponse(error) || isQueryError(error)) {
		if (error.status === 404) {
			return <NotFoundPage />;
		}
		if (error.status === 500) {
			return <ServerErrorPage />;
		}
	}

	return <SomethingWentWrongPage />;
}

export { ErrorPage };
