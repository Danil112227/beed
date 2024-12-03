import cn from "classnames";

import { USER_TYPES } from "@features/users-list";

import { Link } from "@components/common/Link";

import { getFullUserName } from "@helpers/user-name";

import { UserSearchItemProps } from "./types";

function UserSearchItem({
	id,
	firstName,
	lastName,
	patronymic,
	type,
}: UserSearchItemProps) {
	const userName = getFullUserName({ firstName, lastName, patronymic });

	return (
		<Link
			classes="search__result-item"
			to={`/users/${id}`}
			nav={false}
			autoScrollable={true}
		>
			<div className="search__result-name">{userName}</div>
			<div className={cn("tag type-" + USER_TYPES[type])}>
				{USER_TYPES[type]}
			</div>
		</Link>
	);
}

export { UserSearchItem };
