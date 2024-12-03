import { DisciplineCreateForm } from "@features/discipline-create";

import "./AddDisciplineRoot.styles.scss";

function AddDisciplineRoot() {
	return (
		<div className="section add-user-section">
			<div className="container">
				<h1 className="main-title">Add discipline</h1>
				<DisciplineCreateForm />
			</div>
		</div>
	);
}

export { AddDisciplineRoot };
