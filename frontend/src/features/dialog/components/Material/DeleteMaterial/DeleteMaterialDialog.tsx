import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";

import { queryClient } from "@query/index";

import { useMaterialsQuery, deleteMaterial } from "@api/services/materials";

import { DeleteMaterialDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Warning from "@assets/vectors/warning.svg?react";

import "./DeleteMaterialDialog.styles.scss";

function DeleteMaterialDialog({
	isVisible,
	isLesson,
	onClose,
	onFullClose,
}: DeleteMaterialDialogProps) {
	const [searchParams] = useSearchParams();

	const materialId = searchParams.get("material");

	const { mutate: deleteMaterialMutation } = useMutation({
		mutationFn: deleteMaterial,
	});

	const key = isLesson ? "lesson-material-details" : "material-details";

	const materialDetailsResult = useMaterialsQuery({
		isEnabled: !!materialId && isVisible,
		queryType: key,
		queryKey: [key, { materialId }],
		payload: { id: materialId! },
	});

	const deleteMaterialHandler = () => {
		if (!materialId) {
			return;
		}

		deleteMaterialMutation(
			{ materialId, isLessonOperation: isLesson },
			{
				onSuccess() {
					onFullClose();

					queryClient.invalidateQueries({ queryKey: ["materials"] });
					queryClient.invalidateQueries({ queryKey: ["lesson-materials"] });
				},
			},
		);
	};

	if (!materialDetailsResult || !materialId) {
		return null;
	}

	const { topic } = materialDetailsResult;

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
							{`Delete “${topic}” material?`}
						</span>
						<p className="popup__desc">
							Are you sure you want to delete this material? Once a material is
							deleted it may not be recovered.
						</p>
					</div>
					<div className="popup__footer">
						<div className="popup__footer-row">
							<div className="popup__footer-col">
								<button
									className="popup-btn primary"
									onClick={deleteMaterialHandler}
								>
									Delete material
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

export { DeleteMaterialDialog };
