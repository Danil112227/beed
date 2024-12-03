import { useDialog, DeleteSchoolDialog } from "@features/dialog";

import { Link } from "@components/common/Link";

import { SchoolName } from "../SchoolName";

import { SchoolItemProps } from "./types";

import Del from "@assets/vectors/del.svg?react";
import Edit from "@assets/vectors/edit.svg?react";

function SchoolItem({ school }: SchoolItemProps) {
	const {
		isVisible: isDeleteDialogVisible,
		onOpenDialog: onOpenDeleteDialog,
		onCloseDialog: onCloseDeleteDialog,
	} = useDialog();

	return (
		<>
			<div className="user">
				<Link to={`/schools/${school.id}`} autoScrollable={true} nav={false}>
					<div className="user__info">
						<SchoolName name={school.name} />
					</div>
				</Link>
				<div className="user__options">
					<Link
						classes="user__option"
						to={`/schools/edit/${school.id}`}
						autoScrollable={true}
						nav={false}
					>
						<Edit />
					</Link>
					<button
						type="button"
						className="user__option"
						onClick={onOpenDeleteDialog}
					>
						<Del />
					</button>
				</div>
			</div>

			<DeleteSchoolDialog
				isVisible={isDeleteDialogVisible}
				onClose={onCloseDeleteDialog}
				school={school}
			/>
		</>
	);
}

export { SchoolItem };
