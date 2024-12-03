import { Dialog } from "primereact/dialog";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@query/index";

import {
	removeGradeStudent,
	RemoveGradeStudent,
	RemoveGradeStudentSuccessResponse,
	RemoveGradeStudentValidationError,
	useGradesQuery,
} from "@api/services/grade";

import { DetachStudentDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "./DetachStudentDialog.styles.scss";

function DetachStudentDialog({
	isVisible,
	studentId,
	onClose,
}: DetachStudentDialogProps) {
	const { classId } = useParams();

	const { mutate: removeGradeStudentMutation } = useMutation<
		RemoveGradeStudentSuccessResponse,
		RemoveGradeStudentValidationError,
		RemoveGradeStudent
	>({
		mutationFn: removeGradeStudent,
	});

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId && isVisible,
		queryType: "grade-details",
		queryKey: ["grade-details", { classId }],
		payload: { id: classId! },
	});

	const removeGradeStudentHandler = () => {
		if (!classId || !gradeDetailsResult) {
			return;
		}

		const { users } = gradeDetailsResult;

		const filteredStudents = users
			.filter((user) => user.id !== studentId)
			.map((user) => user.id);

		removeGradeStudentMutation(
			{
				gradeId: classId,
				students: { users: filteredStudents },
			},
			{
				onSuccess() {
					queryClient.invalidateQueries({ queryKey: ["grade-details"] });

					onClose();
				},
			},
		);
	};

	return (
		<Dialog
			blockScroll
			modal
			visible={isVisible}
			draggable={false}
			resizable={false}
			onHide={onClose}
			content={({ hide }) => (
				<div className="popup">
					<button onClick={hide} className="popup__close">
						<Cross />
					</button>
					<div className="popup__body">
						<div className="popup__icon">
							<Warning />
						</div>

						<span className="popup__title">Detach student from the class?</span>
						<p className="popup__desc">
							Are you sure you want to detach this student from the class? You
							can add it again later.
						</p>
					</div>
					<div className="popup__footer">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button
									className="popup-btn primary"
									onClick={removeGradeStudentHandler}
								>
									Detach student
								</button>
							</div>
							<div className="popup__footer-col">
								<button className="popup-btn secondary" onClick={hide}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		/>
	);
}

export { DetachStudentDialog };
