import { useNavigate } from "react-router-dom";

import {
	EditMasterLessonDialog,
	DeleteMasterLessonDialog,
	useDialog,
} from "@features/dialog";

import { MasterRegularEventProps } from "./types";

function MasterRegularEvent({
	masterLessonId,
	teacherName,
	title,
}: MasterRegularEventProps) {
	const navigate = useNavigate();

	const {
		isVisible: isEditMasterLessonDialogVisible,
		onOpenDialog: onOpenEditMasterLessonDialog,
		onCloseDialog: onCloseEditMasterLessonDialog,
	} = useDialog();

	const {
		isVisible: isDeleteMasterLessonDialogVisible,
		onOpenDialog: onOpenDeleteMasterLessonDialog,
		onCloseDialog: onCloseDeleteMasterLessonDialog,
	} = useDialog();

	const openEditMasterLessonHandler = () => {
		navigate(`?lesson=${masterLessonId}`);
		onOpenEditMasterLessonDialog();
	};

	const closeEditMasterLessonHandler = () => {
		onCloseEditMasterLessonDialog(["lesson"]);
	};

	const openDeleteMasterLessonHandler = () => {
		onCloseEditMasterLessonDialog();
		onOpenDeleteMasterLessonDialog();
	};

	const closeDeleteMasterLessonHandler = () => {
		onCloseDeleteMasterLessonDialog();
		onOpenEditMasterLessonDialog();
	};

	const fullCloseDeleteMaterialHandler = () => {
		onCloseDeleteMasterLessonDialog();
		onCloseEditMasterLessonDialog(["material"]);
	};

	return (
		<>
			<div className="lesson">
				<button type="button" onClick={openEditMasterLessonHandler}>
					<div className="lesson__name">{title}</div>
					<div className="lesson__teacher">{teacherName} teacher</div>
				</button>
			</div>

			<EditMasterLessonDialog
				isVisible={isEditMasterLessonDialogVisible}
				onClose={closeEditMasterLessonHandler}
				onDelete={openDeleteMasterLessonHandler}
			/>

			<DeleteMasterLessonDialog
				masterLessonId={masterLessonId}
				isVisible={isDeleteMasterLessonDialogVisible}
				onClose={closeDeleteMasterLessonHandler}
				onFullClose={fullCloseDeleteMaterialHandler}
			/>
		</>
	);
}

export { MasterRegularEvent };
