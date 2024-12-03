import { useParams } from "react-router-dom";

import { useGradesQuery } from "@api/services/grade";
import { useLessonQuery } from "@api/services/timetable";

import { LessonEditForm } from "@features/lesson-update";
import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function EditLessonRoot() {
	const { classId, lessonId } = useParams();

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId: classId }],
		payload: { id: classId! },
	});

	const lessonDetailsResult = useLessonQuery({
		isEnabled: !!lessonId,
		queryType: "lesson-details",
		queryKey: ["lesson-details", { lessonId }],
		payload: { id: lessonId! },
	});

	if (!gradeDetailsResult || !classId || !lessonDetailsResult || !lessonId) {
		return null;
	}

	const { name: gradeName, id: gradeId } = gradeDetailsResult;

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Lesson", path: "/classes", isActive: true },
		{ label: `${gradeName}`, path: `/classes/${gradeId}`, isActive: true },
		{
			label: `Lesson`,
			path: `/classes/${gradeId}/lessons/${lessonId}`,
			isActive: true,
		},
		{
			label: `Edit Lesson`,
			path: `/classes/${gradeId}/lessons/esit/${lessonId}`,
			isActive: false,
		},
	];
	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Edit lesson</h1>
				<LessonEditForm />
			</div>
		</div>
	);
}

export { EditLessonRoot };
