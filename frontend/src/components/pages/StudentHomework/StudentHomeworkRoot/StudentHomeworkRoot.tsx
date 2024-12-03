import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { useAuth } from "@features/auth";

import { HomeworkTab } from "@features/user-details";

import "./StudentHomeworkRoot.styles.scss";

function StudentHomeworkRoot() {
	const { user } = useAuth({});

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Homework", path: "/student/homework", isActive: false },
	];

	if (!user) {
		return null;
	}

	const { id } = user;

	return (
		<section className="section profile-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Homework</h1>
				<HomeworkTab externalUserId={id} />
			</div>
		</section>
	);
}

export { StudentHomeworkRoot };
