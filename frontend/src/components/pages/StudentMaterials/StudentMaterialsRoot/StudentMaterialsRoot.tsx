import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { useAuth } from "@features/auth";

import { MaterialsTab } from "@features/user-details";

import "./StudentMaterialsRoot.styles.scss";

function StudentMaterialsRoot() {
	const { user } = useAuth({});

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Materials", path: "/student/materials", isActive: false },
	];

	if (!user) {
		return null;
	}

	const { id } = user;

	return (
		<section className="section profile-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Materials</h1>
				<MaterialsTab externalUserId={id} />
			</div>
		</section>
	);
}

export { StudentMaterialsRoot };
