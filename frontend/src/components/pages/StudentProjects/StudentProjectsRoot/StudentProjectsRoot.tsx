import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { useAuth } from "@features/auth";

import { ProjectsTab } from "@features/user-details";

import "./StudentProjectsRoot.styles.scss";

function StudentProjectsRoot() {
	const { user } = useAuth({});

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Projects", path: "/student/projects", isActive: false },
	];

	if (!user) {
		return null;
	}

	const { id } = user;

	return (
		<section className="section profile-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Projects</h1>
				<ProjectsTab externalUserId={id} />
			</div>
		</section>
	);
}

export { StudentProjectsRoot };
