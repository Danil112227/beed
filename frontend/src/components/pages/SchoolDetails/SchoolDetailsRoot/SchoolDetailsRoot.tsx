import { useParams } from "react-router-dom";

import { useSchoolsQuery } from "@api/services/schools";

import { Link } from "@components/common/Link";

import { Breadcrumb, Breadcrumbs } from "@features/breadcrumbs";
import { useDialog, DeleteSchoolDialog } from "@features/dialog";
import { Tabs } from "@features/school-details";

import Edit from "@assets/vectors/edit.svg?react";
import Del from "@assets/vectors/del.svg?react";
import Calendar from "@assets/vectors/calendar.svg?react";

import "./SchoolDetailsRoot.styles.scss";

function SchoolDetailsRoot() {
	const { id } = useParams();

	const {
		isVisible: isDeleteDialogVisible,
		onOpenDialog: onOpenDeleteDialog,
		onCloseDialog: onCloseDeleteDialog,
	} = useDialog();

	const schoolDetailsResult = useSchoolsQuery({
		isEnabled: !!id,
		queryType: "school-details",
		queryKey: ["school-details", { schoolId: id }],
		payload: { id: id! },
	});

	if (!schoolDetailsResult || !id) {
		return null;
	}

	const {
		id: schoolId,
		first_name,
		last_name,
		email,
		name,
		text,
		school_timezone,
		wats_app,
		can_delete,
		can_edit,
	} = schoolDetailsResult;

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Schools", path: "/schools", isActive: true },
		{ label: name, path: `/schools/${schoolId}`, isActive: false },
	];

	return (
		<>
			<section className="section profile-section gradient-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />

					<div className="profile">
						<div className="profile__head">
							<div className="profile__info">
								<h2 className="profile__name">{name}</h2>
							</div>
							<div className="profile__options">
								{can_delete && (
									<button
										type="button"
										className="profile__option option-btn primary"
										onClick={onOpenDeleteDialog}
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
										to={`/schools/edit/${schoolId}`}
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
									<span className="profile__line-info">{text}</span>
								</div>
								<div className="profile__line">
									<span className="profile__line-title">Contact</span>
									<span className="profile__line-info">
										{first_name} {last_name}
									</span>
								</div>
								<div className="tag-row">
									{!!wats_app.length && (
										<div className="tag-col">
											<div className="tag type-school">{wats_app}</div>
										</div>
									)}
									{!!email.length && (
										<div className="tag-col">
											<div className="tag type-class ">{email}</div>
										</div>
									)}
								</div>
							</div>
							<div className="profile__school-footer">
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
					<Tabs canCreateClass={can_edit} />
				</div>
			</section>

			<DeleteSchoolDialog
				school={schoolDetailsResult}
				isVisible={isDeleteDialogVisible}
				onClose={onCloseDeleteDialog}
			/>
		</>
	);
}

export { SchoolDetailsRoot };
