import { useSchoolsQuery } from "@api/services/schools";

import { Link } from "@components/common/Link";

import { SchoolList } from "@features/school-list/components/SchoolList";
import { usePagination, Pagination } from "@features/pagination";
import { useSearch, Search } from "@features/search";
import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { RoleGuard, UserTypesEnum } from "@features/role-access";

function SchoolsRoot() {
	const { page, offset, limit, onChangePage } = usePagination({});

	const {
		searchValue,
		submittedSearchValue,
		onChangeSearchValue,
		onSubmitSearchValue,
	} = useSearch();

	const schoolsResult = useSchoolsQuery({
		isEnabled: true,
		queryType: "schools",
		queryKey: ["schools", { page }],
		searchParams: {
			limit,
			offset,
		},
	});

	const schoolsSearchResult = useSchoolsQuery({
		isEnabled: !!submittedSearchValue.length,
		queryType: "schools",
		queryKey: ["schools", { search: submittedSearchValue }],
		searchParams: {
			limit: 10000,
			search: submittedSearchValue,
		},
	});

	if (!schoolsResult) {
		return null;
	}

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Schools", path: "/schools", isActive: false },
	];

	const { results: schools, count: totalCount } = schoolsResult;

	return (
		<>
			<section className="section user-head-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />
					<h1 className="main-title">Schools</h1>
					<div className="user-form">
						<div className="user-form__row">
							<Search
								schemaKey="schools"
								searchResult={schoolsSearchResult}
								searchValue={searchValue}
								inputPlaceholder="Search school"
								submittedSearchValue={submittedSearchValue}
								onChangeSearchValue={onChangeSearchValue}
								onSubmitSearchValue={onSubmitSearchValue}
							/>
							<RoleGuard
								roles={[UserTypesEnum.TEACHER]}
								permissions={["can_create_school"]}
							>
								<Link
									to="/schools/add"
									autoScrollable={true}
									nav={false}
									classes="btn primary"
								>
									Create school
								</Link>
							</RoleGuard>
						</div>
					</div>
				</div>
			</section>

			<section className="section user-list-section">
				<div className="container">
					{!schools.length && <span>No schools added</span>}
					{!!schools.length && <SchoolList schools={schools} />}
					<Pagination
						currentPage={page}
						totalCount={totalCount}
						from={offset}
						to={page * limit}
						onChangePage={onChangePage}
					/>
				</div>
			</section>
		</>
	);
}

export { SchoolsRoot };
