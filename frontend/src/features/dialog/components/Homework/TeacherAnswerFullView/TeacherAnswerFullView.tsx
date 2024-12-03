import { format } from "date-fns";

import { StudentAnswerView } from "../StudentAnswerView";

import { DocumentItem } from "@features/user-details";
import { USER_TYPES } from "@features/users-list";

import { getListKey } from "@utils/list-key";

import { TeacherAnswerFullViewProps } from "./types";

import "./TeacherAnswerFullView.styles.scss";

function TeacherAnswerFullView({ studentAnswer }: TeacherAnswerFullViewProps) {
	const { homework } = studentAnswer;
	const { author, deadline, type, description, documents } = homework;
	const { first_name, last_name } = author;

	const formattedDeadlineDate = format(deadline, "dd.MM.yyyy");

	const formattedUserType = USER_TYPES[type];

	const studentAnswerDocuments = studentAnswer.documents || [];
	const studentAnswerDescription = studentAnswer.description || "";

	return (
		<>
			<div className="popup__col">
				<div className="popup__desc-wrap">
					<p
						className="popup__material-desc"
						dangerouslySetInnerHTML={{ __html: description }}
					></p>
				</div>
			</div>

			<div className="popup__col">
				{!!documents.length && (
					<>
						<span className="popup__view-title">Materials</span>
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
					</>
				)}

				<span className="popup__material-added-by">
					Added {formattedDeadlineDate} by {formattedUserType}{" "}
					<span className="popup__material-added-name">
						{last_name} {first_name}
					</span>
				</span>
			</div>

			<StudentAnswerView
				description={studentAnswerDescription}
				documents={studentAnswerDocuments}
			/>
		</>
	);
}

export { TeacherAnswerFullView };
