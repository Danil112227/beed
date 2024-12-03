import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

import { queryClient } from "@query/index";

import { deleteGrade } from "@api/services/grade";

import { DeleteClassDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "../../User/DeleteUserDialog/DeleteUserDialog.styles.scss";

function DeleteClassDialog({
	isVisible,
	className,
	classId,
	onClose,
}: DeleteClassDialogProps) {
	const navigate = useNavigate();

	const { mutate: deleteGradeMutation } = useMutation({
		mutationFn: deleteGrade,
	});

	const deleteGradeHandler = () => {
		deleteGradeMutation(
			{ gradeId: classId.toString() },
			{
				onSuccess() {
					navigate("/classes", { replace: true });

					queryClient.invalidateQueries({ queryKey: ["grades"] });
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
						<span className="popup__title">
							Delete “{className} class” from the school?
						</span>
						<p className="popup__desc">
							Are you sure you want to delete this class? Once a class is
							deleted it may not be recovered.
						</p>
					</div>
					<div className="popup__footer">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button
									className="popup-btn primary"
									onClick={deleteGradeHandler}
								>
									Delete class
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
		></Dialog>
	);
}

export { DeleteClassDialog };
