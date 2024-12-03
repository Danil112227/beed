import { Link } from "@components/common/Link";

import { RegularEventProps } from "./types";

function RegularEvent({
	gradeId,
	lessonId,
	teacherName,
	title,
}: RegularEventProps) {
	return (
		<div className="lesson">
			<Link
				to={`/classes/${gradeId}/lessons/${lessonId}`}
				nav={false}
				autoScrollable={true}
			>
				<div className="lesson__name">{title}</div>
				<div className="lesson__teacher">{teacherName} teacher</div>
			</Link>
		</div>
	);
}

export { RegularEvent };
