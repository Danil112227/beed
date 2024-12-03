import cn from "classnames";

import { Link } from "@components/common/Link";

import { ClassSearchItemProps } from "./types";

function ClassSearchItem({ className, schoolName, id }: ClassSearchItemProps) {
	return (
		<Link
			classes="search__result-item"
			to={`/classes/${id}`}
			nav={false}
			autoScrollable={true}
		>
			<div className="search__result-name">{className}</div>
			<div className={cn("tag type-student")}>{schoolName}</div>
		</Link>
	);
}

export { ClassSearchItem };
