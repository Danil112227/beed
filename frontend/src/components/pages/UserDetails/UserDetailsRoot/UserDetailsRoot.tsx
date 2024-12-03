import { useNavigate, useParams } from "react-router-dom";
import { format, parse } from "date-fns";
import { useMutation } from "@tanstack/react-query";

import { useUsersQuery, resetPassword, superLogin } from "@api/services/users";

import { Link } from "@components/common/Link";

import { Breadcrumb, Breadcrumbs } from "@features/breadcrumbs";
import { useDialog, DeleteUserDialog } from "@features/dialog";
import { RoleGuard, UserTypesEnum } from "@features/role-access";
import {
	Tabs,
	ChildrenList,
	LeadershipList,
	DisciplineList,
} from "@features/user-details";

import { getFullUserName } from "@helpers/user-name";
import { getListKey } from "@utils/list-key";

import { USER_TYPES } from "@features/users-list";

import Edit from "@assets/vectors/edit.svg?react";
import Del from "@assets/vectors/del.svg?react";

import "./UserDetailsRoot.styles.scss";
import "../../ParentProfile/ParentProfileRoot/ParentProfileRoot.styles.scss";
import { userAuthSuccessResponseSchema } from "@api/services/auth";
import { getInitPath } from "@features/auth";
import { useAuth } from "@features/auth/hooks/useAuth";
import {
	SuperLogin,
	SuperLoginValidationError,
	UserAuthResponse,
} from "@api/services/users/types";

function UserDetailsRoot() {
	const navigate = useNavigate();

	const { onLogin } = useAuth({});

	const { id } = useParams();

	const {
		isVisible: isDeleteDialogVisible,
		onOpenDialog: onOpenDeleteDialog,
		onCloseDialog: onCloseDeleteDialog,
	} = useDialog();

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

	const { mutate: resetPasswordMutation } = useMutation({
		mutationFn: resetPassword,
	});

	const { mutate: superLoginMutation } = useMutation<
		UserAuthResponse,
		SuperLoginValidationError,
		SuperLogin
	>({
		mutationFn: superLogin,
	});

	if (!userDetailsExtendedResult || !userDetailsShortResult || !id) {
		return null;
	}

	const {
		id: userId,
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
		child,
		my_grades,
		disciplines,
		can_delete,
		can_edit,
		can_super_login,
	} = userDetailsExtendedResult;

	const { grades } = userDetailsShortResult;

	const fullUserName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
		patronymic: Patronymic,
	});

	const breadcrumbName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
	});

	const userType = USER_TYPES[type];
	const formattedUserType = userType[0].toUpperCase() + userType.slice(1);
	const formattedBirthday = format(
		parse(birthday, "yyyy-MM-dd", new Date()),
		"dd.MM.yyyy",
	);

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Users", path: "/users", isActive: true },
		{ label: breadcrumbName, path: `/users/${userId}`, isActive: false },
	];

	const formattedDedupedSchools = Array.from(
		new Set(grades.map((grade) => `${grade.school.name}|${grade.school.id}`)),
	);
	const formattedGrades = grades.map((grade) => `${grade.name}|${grade.id}`);

	const resetPasswordHandler = () => {
		resetPasswordMutation({ username });
	};

	const superLoginHandler = () => {
		superLoginMutation(
			{ username },
			{
				onSuccess(data) {
					const validatedUserDetails =
						userAuthSuccessResponseSchema.safeParse(data);

					if (validatedUserDetails.success) {
						const { type } = validatedUserDetails.data;
						const redirectPath = getInitPath(type);
						navigate(redirectPath);
						onLogin(validatedUserDetails.data);
					}
				},
			},
		);
	};

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
									{formattedDedupedSchools.map((school) => {
										const [schoolName, schoolId] = school.split("|");

										return (
											<div
												key={getListKey("user-school", schoolName)}
												className="profile__tag-col"
											>
												<Link
													nav={false}
													autoScrollable={true}
													to={`/schools/${schoolId}`}
												>
													<div className="tag type-school">{schoolName}</div>
												</Link>
											</div>
										);
									})}
									{formattedGrades.map((grade) => {
										const [gradeName, gradeId] = grade.split("|");

										return (
											<div
												key={getListKey("user-grade", gradeName)}
												className="profile__tag-col"
											>
												<Link
													nav={false}
													autoScrollable={true}
													to={`/classes/${gradeId}`}
												>
													<div className="tag type-class">{gradeName}</div>
												</Link>
											</div>
										);
									})}
								</div>
							</div>

							<div className="profile__options">
								{can_delete && (
									<button
										type="button"
										className="profile__option option-btn primary"
										onClick={onOpenDeleteDialog}
									>
										<span className="option-btn__text">Delete</span>
										<div className="option-btn__icon">
											<Del />
										</div>
									</button>
								)}
								{can_edit && (
									<Link
										classes="profile__option option-btn secondary"
										to={`/users/edit/${userId}`}
										autoScrollable={true}
										nav={false}
									>
										<span className="option-btn__text">Edit</span>
										<div className="option-btn__icon">
											<Edit />
										</div>
									</Link>
								)}
								<RoleGuard
									roles={[UserTypesEnum.TEACHER]}
									permissions={["can_change_password"]}
								>
									<button
										type="button"
										className="profile__option option-btn primary"
										onClick={resetPasswordHandler}
									>
										<span className="option-btn__text">Reset password</span>
									</button>
								</RoleGuard>
								{can_super_login && (
									<button
										type="button"
										className="profile__option option-btn primary"
										onClick={superLoginHandler}
									>
										<span className="option-btn__text">Login by</span>
									</button>
								)}
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
					{type === 0 && <Tabs />}
					{type === 1 && (
						<DisciplineList
							isCreatable={false}
							teacher={userDetailsExtendedResult}
							disciplines={disciplines}
							invalidateQueryKeyOnSuccess="users-details-extended"
							isDeleteActive={false}
						/>
					)}
					{type === 2 && <LeadershipList grades={my_grades} />}
					{type === 3 && <ChildrenList childs={child} />}
				</div>
			</section>

			<DeleteUserDialog
				isVisible={isDeleteDialogVisible}
				onClose={onCloseDeleteDialog}
			/>
		</>
	);
}

export { UserDetailsRoot };
