import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { Timetable } from "@features/timetable";
import { useAuth } from "@features/auth";

import "./StudentTimetableRoot.styles.scss";

function StudentTimetableRoot() {
	const { user } = useAuth({});

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Timetable", path: "/student/timetable", isActive: false },
	];

	if (!user) {
		return null;
	}

	const { id } = user;

	return (
		<section className="section profile-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Lesson timetable</h1>
				<Timetable isTimetableTemplate={false} externalUserId={id} isTimetableTemplateEditable={false} />
			</div>
		</section>
	);
}

export { StudentTimetableRoot };
