import { useAuth } from "@features/auth";

import { Link } from "@components/common/Link";

import { getFullUserName } from "@helpers/user-name";

import "./Profile.styles.scss";

function Profile() {
	const { user } = useAuth({});

	if (!user) {
		return null;
	}

	const { first_name, last_name } = user;

	const initialsNameAvatar = last_name[0] + first_name[0];

	const userFullName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
	});

	return (
		<Link classes="header-profile" nav={false} autoScrollable={true} to="/my">
			<div className="header-profile__avatar">
				<span className="header-profile__initials">{initialsNameAvatar}</span>
			</div>
			<span className="header-profile__name">{userFullName}</span>
		</Link>
	);
}

export { Profile };
