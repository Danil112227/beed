import { USER_TYPES } from "@features/users-list";

import { getFullUserName } from "@helpers/user-name";

import { AuthorProps } from "./types";

function Author({ user }: AuthorProps) {
	const { first_name, last_name, type } = user;

	const userFullName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
	});

	const userType = USER_TYPES[type];

	return (
		<div className="material__owner">
			<span className="material__owner-by">Added by : </span>
			<span className="">
				{userType} {userFullName}
			</span>
		</div>
	);
}

export { Author };
