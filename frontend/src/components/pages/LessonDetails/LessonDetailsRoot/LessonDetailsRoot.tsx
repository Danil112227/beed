import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { useGradesQuery } from "@api/services/grade";
import { useLessonQuery } from "@api/services/timetable";

import { Link } from "@components/common/Link";

import { useDialog, DeleteLessonDialog } from "@features/dialog";
import { Breadcrumb, Breadcrumbs } from "@features/breadcrumbs";

import { Tabs } from "@features/lesson-details";

import Edit from "@assets/vectors/edit.svg?react";
import Del from "@assets/vectors/del.svg?react";

function LessonDetailsRoot() {
	const { classId, lessonId } = useParams();

	const {
		isVisible: isDeleteLessonDialogVisible,
		onOpenDialog: onOpenDeleteLessonDialog,
		onCloseDialog: onCloseDeleteLessonDialog,
	} = useDialog();

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

	if (!gradeDetailsResult || !lessonDetailsResult || !classId || !lessonId) {
		return null;
	}

	const { name } = gradeDetailsResult;

	const {
		title,
		description,
		lesson_link,
		start_time,
		end_time,
		temp_teacher,
		lesson_template,
		can_delete,
		can_edit,
		can_edit_student_list,
	} = lessonDetailsResult;

	const lessonTeacher = temp_teacher ?? lesson_template?.discipline.teacher;

	const formattedStartLessonDate = format(new Date(start_time), "h:m a");
	const formattedEndLessonDate = format(new Date(end_time), "h:m a");

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Classes", path: "/classes", isActive: true },
		{ label: name, path: `/classes/${classId}`, isActive: true },
		{ label: "Lessons", path: `/lessons/${lessonId}`, isActive: false },
	];

	return (
		<>
			<section className="section profile-section gradient-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />

					<div className="profile">
						<div className="profile__head">
							<div className="profile__info">
								<h2 className="profile__name">{title}</h2>
								<p dangerouslySetInnerHTML={{ __html: description }}></p>
							</div>

							<div className="profile__options">
								{can_delete && (
									<button
										type="button"
										className="profile__option option-btn primary"
										onClick={onOpenDeleteLessonDialog}
									>
										<span className="option-btn__text">Delete</span>
										<div className="option-btn__icon">
											<Del />
										</div>
									</button>
								)}
								{can_edit && (
									<Link
										classes="profile__option option-btn secondary"
										to={`/classes/${classId}/lessons/edit/${lessonId}`}
										autoScrollable={true}
										nav={false}
									>
										<span className="option-btn__text">Edit</span>
										<div className="option-btn__icon">
											<Edit />
										</div>
									</Link>
								)}
							</div>
						</div>
						<div className="profile__body">
							<div className="profile__school-col">
								<div className="profile__line">
									<span className="profile__line-title">Lesson link</span>
									<a
										href={`${lesson_link}`}
										target="_blank"
										className="profile__line-info"
									>
										{lesson_link}
									</a>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Duration</span>
									<span className="profile__line-info">
										{formattedStartLessonDate} - {formattedEndLessonDate}
									</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Teacher: </span>
									<span className="profile__line-info">
										{lessonTeacher?.last_name} {lessonTeacher?.first_name}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="profile-tabs-section">
				<div className="container">
					<Tabs canEdit={can_edit} canEditStudentList={can_edit_student_list} />
				</div>
			</section>

			<DeleteLessonDialog
				lessonId={lessonDetailsResult.id}
				classId={gradeDetailsResult.id}
				isVisible={isDeleteLessonDialogVisible}
				onClose={onCloseDeleteLessonDialog}
			/>
		</>
	);
}

export { LessonDetailsRoot };
