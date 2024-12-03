import { RoleGuard, UserTypesEnum } from "@features/role-access";
import { useDialog, DeleteClassDialog } from "@features/dialog";

import { Link } from "@components/common/Link";
import { ClassName } from "../ClassName";

import { getListKey } from "@utils/list-key";

import Del from "@assets/vectors/del.svg?react";
import Edit from "@assets/vectors/edit.svg?react";

import { ClassItemProps } from "./types";

function ClassItem({ classItem, isEditable }: ClassItemProps) {
	const {
		isVisible: isDeleteDialogVisible,
		onOpenDialog: onOpenDeleteDialog,
		onCloseDialog: onCloseDeleteDialog,
	} = useDialog();

	const { tutor, can_delete, can_edit } = classItem;

	const formattedTutors = tutor.map(
		(tutor) => `Tutor: ${tutor.last_name} ${tutor.first_name}`,
	);

	return (
		<>
			<div className="user">
				<Link to={`/classes/${classItem.id}`} autoScrollable={true} nav={false}>
					<div className="user__info">
						<ClassName className={classItem.name} />

						<div className="user__tags">
							<div className="user__tag-col">
								<span className="tag user__tag type-student">
									{classItem.school.name}
								</span>
							</div>
							{formattedTutors.map((tutor, index) => (
								<div key={getListKey("tutor", index)} className="user__tag-col">
									<span className="tag user__tag type-student">{tutor}</span>
								</div>
							))}
						</div>
					</div>
				</Link>
				<RoleGuard roles={[UserTypesEnum.TEACHER]} permissions={[]}>
					<div className="user__options">
						{isEditable && can_edit && (
							<Link
								classes="user__option"
								to={`/classes/edit/${classItem.id}`}
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
					</div>
				</RoleGuard>
			</div>

			<DeleteClassDialog
				isVisible={isDeleteDialogVisible}
				className={classItem.name}
				classId={classItem.id}
				onClose={onCloseDeleteDialog}
			/>
		</>
	);
}

export { ClassItem };
