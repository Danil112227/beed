import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

import { queryClient } from "@query/index";

import { deleteDiscipline } from "@api/services/discipline";

import { DeleteDesciplineDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "../../User/DeleteUserDialog/DeleteUserDialog.styles.scss";

function DeleteDisciplineDialog({
	isVisible,
	disciplineId,
	disciplineName,
	invalidateQueryKeyOnSuccess,
	onClose,
}: DeleteDesciplineDialogProps) {
	const { mutate: deleteDisciplineMutation } = useMutation({
		mutationFn: deleteDiscipline,
	});

	const deleteDisciplineHandler = () => {
		deleteDisciplineMutation(
			{ disciplineId: disciplineId.toString() },
			{
				onSuccess() {
					queryClient.invalidateQueries({
						queryKey: [invalidateQueryKeyOnSuccess],
					});

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
						<span className="popup__title">
							Detach “{disciplineName}” from the class?
						</span>
						<p className="popup__desc">
							Are you sure you want to detach this discipline from the class?
							You can add it again later.
						</p>
					</div>
					<div className="popup__footer">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button
									className="popup-btn primary"
									onClick={deleteDisciplineHandler}
								>
									Detach discipline
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

export { DeleteDisciplineDialog };
