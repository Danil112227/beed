import { useParams } from "react-router-dom";

import { useMaterialsQuery } from "@api/services/materials";

import { usePagination, Pagination } from "@features/pagination";
import {
	DeleteMaterialDialog,
	EditMaterialDialog,
	ViewMaterialDialog,
	useDialog,
} from "@features/dialog";

import { Link } from "@components/common/Link";

import { DocumentItem, Author } from "@features/user-details";

import { getListKey } from "@utils/list-key";

import "./MaterialsTab.styles.scss";

function MaterialsTab() {
	const { lessonId } = useParams();

	const { page, offset, limit, onChangePage } = usePagination({
		perPageItemsCount: 6,
	});

	const {
		isVisible: isDeleteMaterialDialogVisible,
		onOpenDialog: onOpenDeleteMaterialDialog,
		onCloseDialog: onCloseDeleteMaterialDialog,
	} = useDialog();

	const {
		isVisible: isEditMaterialDialogVisible,
		onOpenDialog: onOpenEditMaterialDialog,
		onCloseDialog: onCloseEditMaterialDialog,
	} = useDialog();

	const {
		isVisible: isViewMaterialDialogVisible,
		onOpenDialog: onOpenViewMaterialDialog,
		onCloseDialog: onCloseViewMaterialDialog,
	} = useDialog();

	const lessonMaterialsResult = useMaterialsQuery({
		isEnabled: !!lessonId,
		isPaginationEnabled: true,
		queryType: "lesson-materials",
		queryKey: ["lesson-materials", { limit, offset, lessonId }],
		searchParams: {
			limit,
			offset,
			lesson: lessonId,
		},
	});

	const openEditMaterialHandler = () => {
		onCloseViewMaterialDialog();
		onOpenEditMaterialDialog();
	};

	const closeEditMaterialHandler = () => {
		onOpenViewMaterialDialog();
		onCloseEditMaterialDialog();
	};

	const openDeleteMaterialHandler = () => {
		onCloseViewMaterialDialog();
		onOpenDeleteMaterialDialog();
	};

	const closeDeleteMaterialHandler = () => {
		onOpenViewMaterialDialog();
		onCloseDeleteMaterialDialog();
	};

	const fullCloseDeleteMaterialHandler = () => {
		onCloseDeleteMaterialDialog();
		onCloseViewMaterialDialog(["material"]);
	};

	const closeViewMaterialHandler = () => {
		onCloseViewMaterialDialog(["material"]);
	};

	if (!lessonMaterialsResult) {
		return <></>;
	}

	const { results: materials, count: totalCount } = lessonMaterialsResult;

	return (
		<>
			<div className="profile-tabs__content active">
				{!materials.length && <span>No materials added</span>}
				{!!materials.length && (
					<div className="material-row">
						{materials.map((material) => (
							<div
								key={getListKey("document", material.id)}
								className="material-col"
							>
								<div className="material">
									<Link
										nav={false}
										autoScrollable={true}
										to={`?material=${material.id}`}
										onClick={onOpenViewMaterialDialog}
									>
										<span className="material__name">{material.topic}</span>
										<span
											className="material__desc"
											dangerouslySetInnerHTML={{ __html: material.description }}
										></span>
										<Author user={material.author} />
									</Link>
									<div className="material__list">
										{material.documents.map((document) => (
											<DocumentItem
												key={getListKey("document", document.id)}
												document={document}
											/>
										))}
										{material.documents.length > 3 && (
											<span className="material__another">
												+ 1 another files...
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				<Pagination
					perPageItemsCount={8}
					currentPage={page}
					totalCount={totalCount}
					from={offset}
					to={page * limit}
					onChangePage={onChangePage}
				/>
			</div>

			<DeleteMaterialDialog
				isLesson={true}
				isVisible={isDeleteMaterialDialogVisible}
				onClose={closeDeleteMaterialHandler}
				onFullClose={fullCloseDeleteMaterialHandler}
			/>

			<EditMaterialDialog
				isLesson={true}
				isVisible={isEditMaterialDialogVisible}
				onClose={closeEditMaterialHandler}
			/>

			<ViewMaterialDialog
				isLesson={true}
				isVisible={isViewMaterialDialogVisible}
				onEdit={openEditMaterialHandler}
				onDelete={openDeleteMaterialHandler}
				onClose={closeViewMaterialHandler}
			/>
		</>
	);
}

export { MaterialsTab };
