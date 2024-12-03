import { useMemo } from "react";

import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { useHomeworksQuery } from "@api/services/homework";

import { HomeworkItem } from "@features/user-details";
import {
	useDialog,
	ViewHomeworkDialog,
	EditHomeworkDialog,
	DeleteHomeworkDialog,
} from "@features/dialog";

import { getListKey } from "@utils/list-key";

import { ProjectsTabProps } from "./types";

function ProjectsTab({ externalUserId }: ProjectsTabProps) {
	const { id } = useParams();

	const {
		isVisible: isViewHomeworkDialogVisible,
		onOpenDialog: onOpenViewHomeworkDialog,
		onCloseDialog: onCloseViewHomeworkDialog,
	} = useDialog();

	const {
		isVisible: isEditHomeworkDialogVisible,
		onOpenDialog: onOpenEditHomeworkDialog,
		onCloseDialog: onCloseEditHomeworkDialog,
	} = useDialog();

	const {
		isVisible: isDeleteHomeworkDialogVisible,
		onOpenDialog: onOpenDeleteHomeworkDialog,
		onCloseDialog: onCloseDeleteHomeworkDialog,
	} = useDialog();

	const projectsResult = useHomeworksQuery({
		isEnabled: !!id || !!externalUserId,
		queryType: "homework",
		queryKey: ["all-projects", { user: id || externalUserId }],
		searchParams: {
			limit: 1000,
			filter: "project",
			user: id || externalUserId,
		},
	});

	const sortedProjects = useMemo(() => {
		if (!projectsResult?.results) {
			return [];
		}

		return projectsResult.results.slice().sort((a, b) => {
			return a.deadline.getTime() - b.deadline.getTime();
		});
	}, [projectsResult?.results]);

	const currentDate = new Date(format(new Date(), "yyyy-MM-dd"));
	const foundProjectIndex = sortedProjects.findIndex((project) => {
		return project.deadline >= currentDate;
	});

	const upcomingProjects = useMemo(() => {
		if (foundProjectIndex === -1) {
			return [];
		}

		return sortedProjects.slice(foundProjectIndex, foundProjectIndex + 3);
	}, [sortedProjects, foundProjectIndex]);

	if (!projectsResult) {
		return <></>;
	}

	const openEditHomeworkHandler = () => {
		onCloseViewHomeworkDialog();
		onOpenEditHomeworkDialog();
	};

	const closeEditHomeworkHandler = () => {
		onOpenViewHomeworkDialog();
		onCloseEditHomeworkDialog();
	};

	const openDeleteHomeworkHandler = () => {
		onCloseViewHomeworkDialog();
		onOpenDeleteHomeworkDialog();
	};

	const closeDeleteHomeworkHandler = () => {
		onOpenViewHomeworkDialog();
		onCloseDeleteHomeworkDialog();
	};

	const fullCloseDeleteHomeworkHandler = () => {
		onCloseDeleteHomeworkDialog();
		onCloseViewHomeworkDialog(["homework", "answer_id"]);
	};

	const closeViewHomeworkHandler = () => {
		onCloseViewHomeworkDialog(["homework", "answer_id"]);
	};

	return (
		<>
			<div className="profile-tabs__content active">
				{!!upcomingProjects.length && (
					<div className="project-wrap">
						<div className="info-head">
							<span className="section-title">Upcoming</span>
						</div>

						<div className="project-row">
							{upcomingProjects.map((project) => (
								<HomeworkItem
									key={getListKey("project", project.id)}
									homework={project}
									onOpenViewHomeworkDialog={onOpenViewHomeworkDialog}
								/>
							))}
						</div>
					</div>
				)}
				{!sortedProjects.length && <span>No projects added</span>}
				{!!sortedProjects.length && (
					<div className="project-wrap">
						<div className="info-head">
							<span className="section-title">All projects</span>
						</div>

						<div className="project-row">
							{sortedProjects.map((project) => (
								<HomeworkItem
									key={getListKey("project", project.id)}
									homework={project}
									onOpenViewHomeworkDialog={onOpenViewHomeworkDialog}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			<DeleteHomeworkDialog
				isVisible={isDeleteHomeworkDialogVisible}
				onClose={closeDeleteHomeworkHandler}
				onFullClose={fullCloseDeleteHomeworkHandler}
			/>

			<EditHomeworkDialog
				isVisible={isEditHomeworkDialogVisible}
				onClose={closeEditHomeworkHandler}
			/>

			<ViewHomeworkDialog
				isControlActive={false}
				isAttachUser={true}
				isOverallInterface={false}
				isVisible={isViewHomeworkDialogVisible}
				onEdit={openEditHomeworkHandler}
				onDelete={openDeleteHomeworkHandler}
				onClose={closeViewHomeworkHandler}
			/>
		</>
	);
}

export { ProjectsTab };
