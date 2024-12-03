import { DocumentItem } from "@features/user-details";

import { getListKey } from "@utils/list-key";

import { StudentAnswerViewProps } from "./types";

import "./StudentAnswerView.styles.scss";

function StudentAnswerView({ documents, description }: StudentAnswerViewProps) {
	return (
		<>
			<div className="popup__col">
				<span className="popup__view-title">Homework result</span>
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
				<span className="popup__answer">Answer</span>
				<p
					className="popup__answer-desc"
					dangerouslySetInnerHTML={{__html: description ? description : "auto created answer by teacher"}}
				></p>
			</div>
		</>
	);
}

export { StudentAnswerView };
