import { useDialog, DeleteDisciplineDialog } from "@features/dialog";
import { useRoleAccess } from "@features/role-access";

import { DisciplineItemProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";

function DisciplineItem({
	discipline,
	teacher,
	invalidateQueryKeyOnSuccess,
	isDeleteActive,
}: DisciplineItemProps) {
	const { getPermission } = useRoleAccess();

	const {
		isVisible: isDeleteDisciplineDialogVisible,
		onOpenDialog: onOpenDeleteDisciplineDialog,
		onCloseDialog: onCloseDeleteDisciplineDialog,
	} = useDialog();

	const { name, id } = discipline;

	const isDeleteVisible = getPermission([], ["can_delete_discipline"]) && isDeleteActive;

	let firstName = "";
	let lastName = "";

	if (teacher) {
		const { first_name, last_name } = teacher;

		firstName = first_name;
		lastName = last_name;
	}

	if ("teacher" in discipline) {
		const { first_name, last_name } = discipline.teacher;

		firstName = first_name;
		lastName = last_name;
	}

	return (
		<>
			<div className="discipline-col">
				<div className="discipline">
					<div className="discipline__head">
						<span className="discipline__name">{name}</span>
						{isDeleteVisible && (
							<button
								className="discipline__close"
								onClick={onOpenDeleteDisciplineDialog}
							>
								<Cross />
							</button>
						)}
					</div>
					<span className="discipline__owner">
						{firstName} {lastName}
					</span>
				</div>
			</div>

			<DeleteDisciplineDialog
				isVisible={isDeleteDisciplineDialogVisible}
				disciplineId={id}
				disciplineName={name}
				invalidateQueryKeyOnSuccess={invalidateQueryKeyOnSuccess}
				onClose={onCloseDeleteDisciplineDialog}
			/>
		</>
	);
}

export { DisciplineItem };
