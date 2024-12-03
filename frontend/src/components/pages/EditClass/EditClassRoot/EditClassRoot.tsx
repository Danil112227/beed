import { ClassEditForm } from "@features/class-update";
import { useParams } from "react-router-dom";

import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function EditClassRoot() {
	const { id } = useParams();

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Classes", path: "/classes", isActive: true },
		{ label: `Edit class`, path: `/classes/edit/${id}`, isActive: false },
	];

	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Edit class</h1>
				<ClassEditForm />
			</div>
		</div>
	);
}

export { EditClassRoot };
