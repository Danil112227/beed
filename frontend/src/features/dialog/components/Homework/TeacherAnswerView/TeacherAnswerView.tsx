import { DocumentItem } from "@features/user-details";

import { getListKey } from "@utils/list-key";

import { TeacherAnswerViewProps } from "./types";

import "./TeacherAnswerView.styles.scss";

function TeacherAnswerView({ documents, description }: TeacherAnswerViewProps) {
	return (
		<>
			<div className="popup__col">
				<span className="popup__view-title">Teacher review</span>
			</div>

			<div className="popup__col">
				<span className="popup__answer">Comment</span>
				<p
					className="popup__answer-desc"
					dangerouslySetInnerHTML={{ __html: description }}
				></p>
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
		</>
	);
}

export { TeacherAnswerView };
