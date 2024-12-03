import { Link } from "@components/common/Link";

import { getInitPath, useAuth } from "@features/auth";

import { Header } from "@features/header";

function NotFoundPage() {
	const { user } = useAuth({});

	const redirectPath = user ? getInitPath(user.type) : "";

	return (
		<>
			<Header />
			<div>
				<span>Error 404</span>
				<Link to={redirectPath} autoScrollable={true} nav={false}>
					Back to home
				</Link>
			</div>
		</>
	);
}

export { NotFoundPage };
