import { useParams } from "react-router-dom";

import { useGradesQuery } from "@api/services/grade";

import { UsersList } from "@features/users-list";
import { useDialog, AddStudentDialog } from "@features/dialog";

import Plus from "@assets/vectors/blue-plus.svg?react";

import "./StudentsTab.styles.scss";

function StudentsTab() {
	const { classId } = useParams();

	const {
		isVisible: isAddStudentDialogVisible,
		onOpenDialog: onOpenAddStudentDialog,
		onCloseDialog: onCloseAddStudentDialog,
	} = useDialog();

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId: classId }],
		payload: { id: classId! },
	});

	if (!gradeDetailsResult || !classId) {
		return <></>;
	}

	const { users, can_edit_student_list } = gradeDetailsResult;

	const formattedUsers = users.map((user) => ({
		...user,
		can_delete: can_edit_student_list,
		can_edit: can_edit_student_list,
	}));

	return (
		<>
			<div className="info-head">
				<span className="timetable-head__date">{users.length} students</span>
				{can_edit_student_list && (
					<button
						type="button"
						className="profile-tabs__add"
						onClick={onOpenAddStudentDialog}
					>
						<span className="profile-tabs__add-text">Add student</span>
						<div className="profile-tabs__add-icon">
							<Plus />
						</div>
					</button>
				)}
			</div>
			{!users.length && <span>No users added</span>}
			{!!users.length && (
				<UsersList users={formattedUsers} isOnlyDetach={true} />
			)}

			<AddStudentDialog
				isVisible={isAddStudentDialogVisible}
				onClose={onCloseAddStudentDialog}
			/>
		</>
	);
}

export { StudentsTab };
