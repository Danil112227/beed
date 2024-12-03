import { format, parse } from "date-fns";

import { useUsersQuery } from "@api/services/users";

import { useAuth } from "@features/auth";
import { Breadcrumb, Breadcrumbs } from "@features/breadcrumbs";

import {
	TeacherTabs,
	LeadershipList,
	DisciplineList,
} from "@features/user-details";

import { getFullUserName } from "@helpers/user-name";
import { getListKey } from "@utils/list-key";

import { USER_TYPES } from "@features/users-list";

import Logout from "@assets/vectors/logout.svg?react";

import "../../UserDetails/UserDetailsRoot/UserDetailsRoot.styles.scss";
import "../../ParentProfile/ParentProfileRoot/ParentProfileRoot.styles.scss";

function MyRoot() {
	const { user, onLogout } = useAuth({});

	const id = user?.id.toString();

	const userDetailsExtendedResult = useUsersQuery({
		isEnabled: !!id,
		queryType: "users-details-extended",
		queryKey: ["users-details-extended", { userId: id }],
		payload: { id: id! },
	});

	const userDetailsShortResult = useUsersQuery({
		isEnabled: !!id,
		queryType: "users-details-short",
		queryKey: ["users-details-short", { userId: id }],
		payload: { id: id! },
	});

	if (!userDetailsExtendedResult || !userDetailsShortResult || !id) {
		return null;
	}

	const {
		first_name,
		last_name,
		Patronymic,
		type,
		username,
		email,
		user_timezone,
		birthday,
		phone,
		city,
		my_grades,
		disciplines,
	} = userDetailsExtendedResult;

	const { grades } = userDetailsShortResult;

	const fullUserName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
		patronymic: Patronymic,
	});

	const userType = USER_TYPES[type];
	const formattedUserType = userType[0].toUpperCase() + userType.slice(1);
	const formattedBirthday = format(
		parse(birthday, "yyyy-MM-dd", new Date()),
		"dd.MM.yyyy",
	);

	const breadcrumbs: Breadcrumb[] = [
		{ label: "My profile", path: "/my", isActive: false },
	];

	const formattedDedupedSchools = Array.from(
		new Set(grades.map((grade) => grade.school.name)),
	);
	const formattedGrades = grades.map((grade) => grade.name);

	return (
		<>
			<section className="section profile-section gradient-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />

					<div className="profile">
						<div className="profile__head">
							<div className="profile__info">
								<span className="profile__type">{formattedUserType}</span>
								<h2 className="profile__name">{fullUserName}</h2>
								<div className="profile__tags">
									{formattedDedupedSchools.map((school) => (
										<div
											key={getListKey("user-school", school)}
											className="profile__tag-col"
										>
											<div className="tag">{school}</div>
										</div>
									))}
									{formattedGrades.map((grade) => (
										<div
											key={getListKey("user-grade", grade)}
											className="profile__tag-col"
										>
											<div className="tag">{grade}</div>
										</div>
									))}
								</div>
							</div>
							<div className="profile__options">
								<button
									type="button"
									className="profile__option option-btn logout"
									onClick={onLogout}
								>
									<span className="option-btn__text">Log out</span>
									<div className="option-btn__icon">
										<Logout />
									</div>
								</button>
							</div>
						</div>
						<div className="profile__row">
							<div className="profile__col">
								<div className="profile__line">
									<span className="profile__line-title">Login</span>
									<span className="profile__line-info">{username}</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Email</span>
									<span className="profile__line-info">{email}</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Timezone</span>
									<span className="profile__line-info">{user_timezone}</span>
								</div>
							</div>
							<div className="profile__col">
								<div className="profile__line">
									<span className="profile__line-title">Date of birth</span>
									<span className="profile__line-info">
										{formattedBirthday}
									</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Phone</span>
									<span className="profile__line-info">{phone}</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">City</span>
									<span className="profile__line-info">{city}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="profile-tabs-section">
				<div className="container">
					{type === 1 && (
						<>
							<DisciplineList
								isCreatable={false}
								teacher={userDetailsExtendedResult}
								disciplines={disciplines}
								invalidateQueryKeyOnSuccess="users-details-extended"
								isDeleteActive={false}
							/>
							<TeacherTabs />
						</>
					)}
					{type === 2 && <LeadershipList grades={my_grades} />}
				</div>
			</section>
		</>
	);
}

export { MyRoot };
