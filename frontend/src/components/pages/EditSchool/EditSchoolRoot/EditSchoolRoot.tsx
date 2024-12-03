import { useParams } from "react-router-dom";

import { SchoolEditForm } from "@features/school-update";

import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function EditSchoolRoot() {
	const { id } = useParams();

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Schools", path: "/schools", isActive: true },
		{ label: `School profile`, path: `/schools/${id}`, isActive: true },
		{ label: `Edit school`, path: `/schools/edit/${id}`, isActive: false },
	];
	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Edit school</h1>
				<SchoolEditForm />
			</div>
		</div>
	);
}

export { EditSchoolRoot };