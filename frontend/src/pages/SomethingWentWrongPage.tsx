import { Link } from "@components/common/Link";

import { getInitPath, useAuth } from "@features/auth";

import { Header } from "@features/header";

function SomethingWentWrongPage() {
	const { user } = useAuth({});

	const redirectPath = user ? getInitPath(user.type) : "";

	return (
		<>
			<Header />
			<div>
				<span>Something Went Wrong!</span>
				<Link to={redirectPath} autoScrollable={true} nav={false}>
					Back to home
				</Link>
			</div>
		</>
	);
}

export { SomethingWentWrongPage };
