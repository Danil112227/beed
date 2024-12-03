import { SchoolCreateForm } from "@features/school-create";

import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function AddSchoolRoot() {
	const breadcrumbs: Breadcrumb[] = [
		{ label: "Schools", path: "/schools", isActive: true },
		{ label: "Add school", path: `/schools/add`, isActive: false },
	];
	
	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Add school</h1>
				<SchoolCreateForm />
			</div>
		</div>
	);
}

export { AddSchoolRoot };