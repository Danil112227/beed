import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@query/index";

import { deleteSchool } from "@api/services/schools";

import { getFullSchoolName } from "@helpers/school-name";

import { DeleteSchoolDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "../../User/DeleteUserDialog/DeleteUserDialog.styles.scss";

function DeleteSchoolDialog({
	isVisible,
	school,
	onClose,
}: DeleteSchoolDialogProps) {
	const navigate = useNavigate();

	const { id, name } = school;

	const schoolName = getFullSchoolName({ schoolName: name });

	const { mutate: deleteSchoolMutation } = useMutation({
		mutationFn: deleteSchool,
	});

	const deleteGradeHandler = () => {
		deleteSchoolMutation(
			{ schoolId: id.toString() },
			{
				onSuccess() {
					navigate("/schools", { replace: true });

					queryClient.invalidateQueries({ queryKey: ["schools"] });
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
							Delete "{schoolName}" from the list?
						</span>
						<p className="popup__desc">
							Are you sure you want to delete this school? Once a school is
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
									Delete school
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

export { DeleteSchoolDialog };
