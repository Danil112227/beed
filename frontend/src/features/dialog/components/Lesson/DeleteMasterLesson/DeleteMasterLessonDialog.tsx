import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

import { queryClient } from "@query/index";

import { deleteMasterLesson } from "@api/services/timetable";

import { DeleteMasterLessonDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "./DeleteMasterLessonDialog.styles.scss";

function DeleteMasterLessonDialog({
	masterLessonId,
	isVisible,
	onClose,
	onFullClose,
}: DeleteMasterLessonDialogProps) {
	const { mutate: deleteMasterLessonMutation } = useMutation({
		mutationFn: deleteMasterLesson,
	});

	const deleteHomeworkHandler = () => {
		deleteMasterLessonMutation(
			{ masterLessonId: masterLessonId.toString() },
			{
				onSuccess() {
					onFullClose();
					queryClient.invalidateQueries({ queryKey: ["lessons"] });
					queryClient.invalidateQueries({ queryKey: ["master-lessons"] });
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

						<span className="popup__title">{`Delete master lesson?`}</span>
						<p className="popup__desc">
							Are you sure you want to delete this master lesson? Once a lesson
							is deleted it may not be recovered.
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

export { DeleteMasterLessonDialog };
