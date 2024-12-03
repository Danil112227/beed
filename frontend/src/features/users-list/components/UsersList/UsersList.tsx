import { getListKey } from "@utils/list-key";

import { UserItem } from "../UserItem";

import { UsersListProps } from "./types";

function UsersList({ users, isOnlyDetach, isDisableActions }: UsersListProps) {
	return (
		<div className="user-list">
			{users.map((user) => (
				<UserItem
					key={getListKey("user", user.id)}
					user={user}
					isOnlyDetach={isOnlyDetach}
					isDisableActions={isDisableActions}
				/>
			))}
		</div>
	);
}

export { UsersList };
