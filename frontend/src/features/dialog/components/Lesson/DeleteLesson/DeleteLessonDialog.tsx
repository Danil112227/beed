import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

import { deleteLesson } from "@api/services/timetable";

import { DeleteLessonDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "./DeleteLessonDialog.styles.scss";

function DeleteLessonDialog({
	classId,
	lessonId,
	isVisible,
	onClose,
}: DeleteLessonDialogProps) {
	const navigate = useNavigate();

	const { mutate: deleteLessonMutation } = useMutation({
		mutationFn: deleteLesson,
	});

	const deleteHomeworkHandler = () => {
		deleteLessonMutation(
			{ lessonId: lessonId.toString() },
			{
				onSuccess() {
					onClose();

					navigate(`/classes/${classId}`, { replace: true });
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

						<span className="popup__title">{`Delete lesson?`}</span>
						<p className="popup__desc">
							Are you sure you want to delete this lesson? Once a lesson is
							deleted it may not be recovered.
						</p>
					</div>
					<div className="popup__footer">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button
									className="popup-btn primary"
									onClick={deleteHomeworkHandler}
								>
									Delete lesson
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

export { DeleteLessonDialog };
