import { Dialog } from "primereact/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@query/index";

import { deleteUser } from "@api/services/users";

import { DeleteUserDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "./DeleteUserDialog.styles.scss";

function DeleteUserDialog({
	isVisible,
	userId,
	onClose,
}: DeleteUserDialogProps) {
	const { id } = useParams();
	const navigate = useNavigate();

	const { mutate: deleteUserMutation } = useMutation({
		mutationFn: deleteUser,
	});

	const deleteMaterialHandler = () => {
		if (!id && !userId) {
			return;
		}

		deleteUserMutation(
			{ userId: userId?.toString() || id || "" },
			{
				onSuccess() {
					navigate("/users", { replace: true });

					queryClient.invalidateQueries({ queryKey: ["users-short"] });
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
							Delete user from the user list?
						</span>
						<p className="popup__desc">
							Are you sure you want to delete this user? Once a class is deleted
							it may not be recovered.
						</p>
					</div>
					<div className="popup__footer">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button
									className="popup-btn primary"
									onClick={deleteMaterialHandler}
								>
									Delete user
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

export { DeleteUserDialog };
