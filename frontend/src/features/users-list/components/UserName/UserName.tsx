import { getFullUserName } from "@helpers/user-name";

import { UserNameProps } from "./types";

function UserName({ firstName, lastName, patronymic }: UserNameProps) {
	const userName = getFullUserName({ firstName, lastName, patronymic });

	return <span className="user__name">{userName}</span>;
}

export { UserName };
