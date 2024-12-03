import cn from "classnames";

import { Link } from "@components/common/Link";

import { UserName } from "../UserName";

import { getListKey } from "@utils/list-key";

import {
	useDialog,
	DeleteUserDialog,
	DetachStudentDialog,
} from "@features/dialog";
import { USER_TYPES } from "@features/users-list/data/constants";

import { UserItemProps } from "./types";

import Edit from "@assets/vectors/edit.svg?react";
import Del from "@assets/vectors/del.svg?react";
import Cross from "@assets/vectors/cross.svg?react";

function UserItem({
	user,
	isOnlyDetach,
	isDisableActions,
	isCheckboxChecked,
	isCheckboxVisible,
	onToggleCheckbox,
}: UserItemProps) {
	const {
		isVisible: isDeleteDialogVisible,
		onOpenDialog: onOpenDeleteDialog,
		onCloseDialog: onCloseDeleteDialog,
	} = useDialog();

	const {
		isVisible: isDetachStudentDialogVisible,
		onOpenDialog: onOpenDetachStudentDialog,
		onCloseDialog: onCloseDetachStudentDialog,
	} = useDialog();

	const { can_edit, can_delete } = user;

	return (
		<>
			<div className="user">
				{isCheckboxVisible && (
					<>
						<label
							className="user__checkbox"
							htmlFor={"user-checkbox" + user.id}
						>
							<input
								id={"user-checkbox" + user.id}
								type="checkbox"
								checked={isCheckboxChecked}
								className="user__checkbox-input"
								onChange={() => onToggleCheckbox && onToggleCheckbox(user.id)}
							/>

							<div className="user__checkbox-label"></div>
						</label>
					</>
				)}
				<Link to={`/users/${user.id}`} autoScrollable={true} nav={false}>
					<div className="user__info">
						<UserName
							firstName={user.first_name}
							lastName={user.last_name}
							patronymic={user.Patronymic}
						/>

						<div className="user__tags">
							<div className="user__tag-col">
								<span
									className={cn(
										"tag user__tag",
										"type-" + USER_TYPES[user.type],
									)}
								>
									{USER_TYPES[user.type]}
								</span>
							</div>
							{user.grades.map((grade) => (
								<div
									key={getListKey("grade", grade.id)}
									className="user__tag-col"
								>
									<span className="tag user__tag other-tag">
										{grade.school.name} • {grade.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</Link>
				{!isDisableActions && (
					<div className="user__options">
						{!isOnlyDetach && (
							<>
								{can_edit && (
									<Link
										classes="user__option"
										to={`/users/edit/${user.id}`}
										autoScrollable={true}
										nav={false}
									>
										<Edit />
									</Link>
								)}
								{can_delete && (
									<button
										type="button"
										className="user__option"
										onClick={onOpenDeleteDialog}
									>
										<Del />
									</button>
								)}
							</>
						)}
						{isOnlyDetach && can_delete && (
							<button
								type="button"
								className="user__option"
								onClick={onOpenDetachStudentDialog}
							>
								<Cross />
							</button>
						)}
					</div>
				)}
			</div>

			<DeleteUserDialog
				userId={user.id}
				isVisible={isDeleteDialogVisible}
				onClose={onCloseDeleteDialog}
			/>

			<DetachStudentDialog
				studentId={user.id}
				isVisible={isDetachStudentDialogVisible}
				onClose={onCloseDetachStudentDialog}
			/>
		</>
	);
}

export { UserItem };
