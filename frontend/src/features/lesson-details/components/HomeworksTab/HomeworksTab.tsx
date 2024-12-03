import { useParams } from "react-router-dom";

import { useHomeworksQuery } from "@api/services/homework";
import { useLessonQuery } from "@api/services/timetable";

import { usePagination, Pagination } from "@features/pagination";
import { HomeworkItem } from "@features/user-details";
import {
	useDialog,
	ViewHomeworkDialog,
	EditHomeworkDialog,
	DeleteHomeworkDialog,
} from "@features/dialog";

import { getListKey } from "@utils/list-key";

import "./HomeworksTab.styles.scss";

function HomeworksTab() {
	const { lessonId } = useParams();

	const { page, offset, limit, onChangePage } = usePagination({
		perPageItemsCount: 6,
	});

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

	const lessonDetailsResult = useLessonQuery({
		isEnabled: !!lessonId,
		queryType: "lesson-details",
		queryKey: ["lesson-details", { lessonId }],
		payload: { id: lessonId! },
	});

	const homeworksResult = useHomeworksQuery({
		isEnabled: true,
		queryType: "homework",
		queryKey: [
			"all-homeworks",
			{ lesson: lessonDetailsResult?.id, limit, offset },
		],
		searchParams: {
			limit,
			offset,
			lesson: lessonDetailsResult?.id,
		},
	});

	if (!homeworksResult) {
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

	const { count: totalCount, results: homeworks } = homeworksResult;

	return (
		<>
			{!!homeworks.length && (
				<div className="project-row">
					{homeworks.map((homework) => (
						<HomeworkItem
							key={getListKey("homework", homework.id)}
							homework={homework}
							onOpenViewHomeworkDialog={onOpenViewHomeworkDialog}
						/>
					))}
				</div>
			)}
			{!homeworks.length && <span>No homeworks added</span>}

			<Pagination
				perPageItemsCount={8}
				currentPage={page}
				totalCount={totalCount}
				from={offset}
				to={page * limit}
				onChangePage={onChangePage}
			/>

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
				isControlActive={true}
				isAttachUser={false}
				isOverallInterface={true}
				isVisible={isViewHomeworkDialogVisible}
				onEdit={openEditHomeworkHandler}
				onDelete={openDeleteHomeworkHandler}
				onClose={closeViewHomeworkHandler}
			/>
		</>
	);
}

export { HomeworksTab };
