import { useSearchParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { format } from "date-fns";

import { DocumentItem } from "@features/user-details";

import { useMaterialsQuery } from "@api/services/materials";

import { getFullUserName } from "@helpers/user-name";
import { getListKey } from "@utils/list-key";

import { USER_TYPES } from "@features/users-list";

import { ViewMaterialDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Del from "@assets/vectors/del.svg?react";
import Edit from "@assets/vectors/edit.svg?react";

import "./ViewMaterialDialog.styles.scss";

function ViewMaterialDialog({
	isVisible,
	isLesson,
	onDelete,
	onEdit,
	onClose,
}: ViewMaterialDialogProps) {
	const [searchParams] = useSearchParams();

	const materialId = searchParams.get("material");

	const key = isLesson ? "lesson-material-details" : "material-details";

	const materialDetailsResult = useMaterialsQuery({
		isEnabled: !!materialId && isVisible,
		queryType: key,
		queryKey: [key, { materialId }],
		payload: { id: materialId! },
	});

	if (!materialDetailsResult || !materialId) {
		return null;
	}

	const {
		topic,
		description,
		author,
		documents,
		date_added,
		can_delete,
		can_edit,
	} = materialDetailsResult;

	const { first_name, last_name, type } = author;

	const userFullName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
	});

	const userType = USER_TYPES[type];
	const formattedDateAdded = format(new Date(date_added), "dd.MM.yyy");

	return (
		<Dialog
			blockScroll
			modal
			visible={isVisible}
			draggable={false}
			resizable={false}
			onHide={onClose}
			content={({ hide }) => (
				<div className="popup popup--max">
					<div className="popup__head">
						<span className="popup__title main-title">{topic}</span>
						<button onClick={hide} className="popup__close">
							<Cross />
						</button>
					</div>

					<div className="popup__scroll">
						<div className="popup__body">
							<div className="popup__col">
								<span
									className="popup__material-desc"
									dangerouslySetInnerHTML={{ __html: description }}
								></span>
							</div>
							<div className="popup__col">
								<span className="popup__material-added-by">
									Added by:
									<span className="popup__material-added-name">
										{" "}
										{userType} {userFullName}
									</span>
								</span>
							</div>
							<div className="popup__col">
								{!!documents.length && (
									<div className="popup__material-row">
										{documents.map((document) => (
											<div
												className="popup__material-col"
												key={getListKey("document-view", document.id)}
											>
												<DocumentItem document={document} />
											</div>
										))}
									</div>
								)}
							</div>
							<div className="popup__col">
								<span className="popup__material-date">
									Dated {formattedDateAdded}
								</span>
							</div>
						</div>
					</div>

					<div className="popup__footer popup__footer--short">
						<div className="popup__footer-row">
							{can_delete && (
								<div className="popup__footer-col">
									<button className="popup-btn tertiary" onClick={onDelete}>
										Delete
										<Del />
									</button>
								</div>
							)}
							{can_edit && (
								<div className="popup__footer-col">
									<button className="popup-btn secondary" onClick={onEdit}>
										Edit
										<Edit />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		/>
	);
}

export { ViewMaterialDialog };
