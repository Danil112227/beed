import { useParams } from "react-router-dom";

import { useLessonQuery } from "@api/services/timetable";

import { UsersList } from "@features/users-list";
import { useDialog, EditStudentListDialog } from "@features/dialog";

import Edit from "@assets/vectors/edit.svg?react";

import "./StudentsTab.styles.scss";

function StudentsTab() {
	const { lessonId } = useParams();

	const {
		isVisible: isEditStudentListDialogVisible,
		onOpenDialog: onOpenEditStudentListDialog,
		onCloseDialog: onCloseEditStudentListDialog,
	} = useDialog();

	const lessonDetailsResult = useLessonQuery({
		isEnabled: !!lessonId,
		queryType: "lesson-details",
		queryKey: ["lesson-details", { lessonId }],
		payload: { id: lessonId! },
	});

	if (!lessonDetailsResult || !lessonId) {
		return <></>;
	}

	const { students, can_edit_student_list } = lessonDetailsResult;

	const formattedStudents = students.map((student) => ({
		...student,
		can_delete: can_edit_student_list,
		can_edit: can_edit_student_list,
	}));

	return (
		<>
			<div className="info-head">
				<span className="info-head__count">{students.length} students</span>
				{can_edit_student_list && (
					<button
						type="button"
						className="profile-tabs__add"
						onClick={onOpenEditStudentListDialog}
					>
						<span className="profile-tabs__add-text">Edit list</span>
						<div className="profile-tabs__add-icon">
							<Edit />
						</div>
					</button>
				)}
			</div>
			{!students.length && <span>No students added</span>}
			{!!students.length && (
				<UsersList users={formattedStudents} isDisableActions={true} />
			)}

			<EditStudentListDialog
				isVisible={isEditStudentListDialogVisible}
				onClose={onCloseEditStudentListDialog}
			/>
		</>
	);
}

export { StudentsTab };
