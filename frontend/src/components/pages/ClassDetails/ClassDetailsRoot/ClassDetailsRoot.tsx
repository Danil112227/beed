import { useParams } from "react-router-dom";

import { useGradesQuery } from "@api/services/grade";

import { Link } from "@components/common/Link";

import { Breadcrumb, Breadcrumbs } from "@features/breadcrumbs";
import { useDialog, DeleteClassDialog } from "@features/dialog";
import { Tabs } from "@features/class-details";
import { DisciplineList } from "@features/user-details";

import { getListKey } from "@utils/list-key";

import Edit from "@assets/vectors/edit.svg?react";
import Del from "@assets/vectors/del.svg?react";
import Calendar from "@assets/vectors/calendar.svg?react";

import "./ClassDetailsRoot.styles.scss";

function ClassDetailsRoot() {
	const { classId } = useParams();

	const {
		isVisible: isDeleteClassDialogVisible,
		onOpenDialog: onOpenDeleteClassDialog,
		onCloseDialog: onCloseDeleteClassDialog,
	} = useDialog();

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId: classId }],
		payload: { id: classId! },
	});

	if (!gradeDetailsResult || !classId) {
		return null;
	}

	const {
		id: gradeId,
		name,
		school,
		tutor,
		year,
		disciplines,
		description,
		can_delete,
		can_edit,
		can_edit_timetable_template,
		can_create_discipline,
		can_view_user_list
	} = gradeDetailsResult;

	const { school_timezone, id: schoolId } = school;

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Classes", path: "/classes", isActive: true },
		{ label: name, path: `/classes/${gradeId}`, isActive: false },
	];

	const formattedTutors = tutor.map(
		(tutor) => `${tutor.last_name} ${tutor.first_name}|${tutor.id}`,
	);

	return (
		<>
			<section className="section profile-section gradient-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />

					<div className="profile">
						<div className="profile__head">
							<div className="profile__info">
								<h2 className="profile__name">{name}</h2>
								<span className="profile__school-name">{school.name}</span>
							</div>

							<div className="profile__options">
								{can_delete && (
									<button
										type="button"
										className="profile__option option-btn primary"
										onClick={onOpenDeleteClassDialog}
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
										to={`/classes/edit/${gradeId}`}
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
									<span className="profile__line-title">Timezone</span>
									<span className="profile__line-info">{school_timezone}</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Description</span>
									<span className="profile__line-info">{description}</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Year of study</span>
									<span className="profile__line-info">{year}</span>
								</div>
							</div>
							<div className="profile__school-footer">
								<div className="profile__school-tutors">
									<span className="profile__line-title">Tutors</span>
									{formattedTutors.map((tutor, index) => {
										const [tutorName, tutorId] = tutor.split("|");

										return (
											<Link
												nav={false}
												autoScrollable={true}
												to={`/users/${tutorId}`}
												key={getListKey("tutor", index)}
											>
												{tutorName}
											</Link>
										);
									})}
								</div>
								<Link
									nav={false}
									autoScrollable={true}
									to={`/schools/${schoolId}/calendar`}
									classes="show-more"
								>
									<span className="show-more__text">School calendar</span>
									<div className="show-more__icon">
										<Calendar />
									</div>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="profile-tabs-section">
				<div className="container">
					<DisciplineList
						gradeId={gradeId}
						isCreatable={can_create_discipline}
						disciplines={disciplines}
						isDeleteActive={true}
						invalidateQueryKeyOnSuccess="grade-details"
					/>
				</div>
			</section>

			<section className="profile-tabs-section">
				<div className="container">
					<Tabs canEditTimetableTemplate={can_edit_timetable_template} canViewUserList={can_view_user_list}/>
				</div>
			</section>

			<DeleteClassDialog
				isVisible={isDeleteClassDialogVisible}
				className={name}
				classId={gradeId}
				onClose={onCloseDeleteClassDialog}
			/>
		</>
	);
}

export { ClassDetailsRoot };
