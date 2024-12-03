import { Link } from "@components/common/Link";

import { SchoolSearchItemProps } from "./types";

function SchoolSearchItem({ schoolName, id }: SchoolSearchItemProps) {
	return (
		<Link
			classes="search__result-item"
			to={`/schools/${id}`}
			nav={false}
			autoScrollable={true}
		>
			<div className="search__result-name">{schoolName}</div>
		</Link>
	);
}

export { SchoolSearchItem };
