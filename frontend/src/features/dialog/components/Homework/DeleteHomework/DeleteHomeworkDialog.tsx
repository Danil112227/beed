import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

import { queryClient } from "@query/index";

import { deleteHomework } from "@api/services/homework";

import { DeleteHomeworkDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "./DeleteHomeworkDialog.styles.scss";

function DeleteHomeworkDialog({
	isVisible,
	onClose,
	onFullClose,
}: DeleteHomeworkDialogProps) {
	const [searchParams] = useSearchParams();

	const homeworkId = searchParams.get("homework");

	const { mutate: deleteHomeworkMutation } = useMutation({
		mutationFn: deleteHomework,
	});

	const deleteHomeworkHandler = () => {
		if (!homeworkId) {
			return;
		}

		deleteHomeworkMutation(
			{ homeworkId },
			{
				onSuccess() {
					onFullClose();

					queryClient.invalidateQueries({ queryKey: ["all-homeworks"] });
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

						<span className="popup__title">{`Delete homework?`}</span>
						<p className="popup__desc">
							Are you sure you want to delete this homework? Once a homework is
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
									Delete homework
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

export { DeleteHomeworkDialog };
