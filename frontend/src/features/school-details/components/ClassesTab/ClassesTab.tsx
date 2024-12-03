import { useParams } from "react-router-dom";

import { useGradesQuery } from "@api/services/grade";
import { usePagination, Pagination } from "@features/pagination";
import { ClassesList } from "@features/classes-list";

import "./ClassesTab.styles.scss";

function ClassesTab() {
	const { id } = useParams();

	const { page, offset, limit, onChangePage } = usePagination({});

	const classesResult = useGradesQuery({
		isEnabled: true,
		isPaginationEnabled: true,
		queryType: "grades",
		queryKey: ["grades", { limit, offset, id }],
		searchParams: {
			limit,
			offset,
			school_filter: id,
		},
	});

	if (!classesResult) {
		return <></>;
	}

	const { results: classes, count: totalCount } = classesResult;

	return (
		<>
			{!!classes.length && <ClassesList classes={classes} />}
			{!classes.length && <span>No classes added</span>}
			<Pagination
				currentPage={page}
				totalCount={totalCount}
				from={offset}
				to={page * limit}
				onChangePage={onChangePage}
			/>
		</>
	);
}

export { ClassesTab };
