import { ClassCreateForm } from "@features/class-create";

import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function AddClassRoot() {
	const breadcrumbs: Breadcrumb[] = [
		{ label: "Classes", path: "/classes", isActive: true },
		{ label: "Add class", path: `/classes/add`, isActive: false },
	];
	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Add class</h1>
				<ClassCreateForm />
			</div>
		</div>
	);
}

export { AddClassRoot };
