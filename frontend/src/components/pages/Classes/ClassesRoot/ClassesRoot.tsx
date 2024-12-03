import { SelectPicker } from "rsuite";

import { useSchoolsQuery } from "@api/services/schools";
import { useGradesQuery } from "@api/services/grade";

import { Link } from "@components/common/Link";

import { ClassesList } from "@features/classes-list";
import { usePagination, Pagination } from "@features/pagination";
import { useSearch, Search } from "@features/search";
import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { RoleGuard, UserTypesEnum } from "@features/role-access";

import {
	useSelect,
	getSelectedValue,
	getSelectFormattedSchoolsValues,
} from "@features/select";

function ClassesRoot() {
	const { page, offset, limit, onChangePage } = usePagination({});
	const {
		selectedValue: selectedSchool,
		onChangeSelectedValue: onChangeSelectedSchool,
	} = useSelect<number>({});
	const {
		searchValue,
		submittedSearchValue,
		onChangeSearchValue,
		onSubmitSearchValue,
	} = useSearch();

	const classesResult = useGradesQuery({
		isEnabled: true,
		isPaginationEnabled: true,
		queryType: "grades",
		queryKey: ["grades", { page, selectedSchool }],
		searchParams: {
			limit,
			offset,
			school_filter: getSelectedValue(selectedSchool),
		},
	});

	const classesSearchResult = useGradesQuery({
		isEnabled: !!submittedSearchValue.length,
		isPaginationEnabled: true,
		queryType: "grades",
		queryKey: ["grades", { search: submittedSearchValue }],
		searchParams: {
			limit: 10000,
			search: submittedSearchValue,
		},
	});

	const schoolsResult = useSchoolsQuery({
		isEnabled: true,
		queryType: "schools",
		queryKey: ["all-schools"],
		searchParams: {
			limit: 10000,
		},
	});

	const selectFormattedSchoolsOptions = getSelectFormattedSchoolsValues(
		schoolsResult?.results,
	);

	if (!classesResult || !schoolsResult) {
		return null;
	}

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Classes", path: "/classes", isActive: false },
	];

	const { results: classes, count: totalCount } = classesResult;

	return (
		<>
			<section className="section user-head-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />
					<h1 className="main-title">Classes</h1>
					<div className="user-form">
						<div className="user-form__row">
							<Search
								schemaKey="grades"
								searchResult={classesSearchResult}
								searchValue={searchValue}
								inputPlaceholder="Search classes"
								submittedSearchValue={submittedSearchValue}
								onChangeSearchValue={onChangeSearchValue}
								onSubmitSearchValue={onSubmitSearchValue}
							/>
							<RoleGuard
								roles={[UserTypesEnum.TEACHER]}
								permissions={["can_create_classes"]}
							>
								<Link
									to="/classes/add"
									autoScrollable={true}
									nav={false}
									classes="btn primary"
								>
									Create class
								</Link>
							</RoleGuard>
						</div>
						<div className="user-form__filter-row">
							<div className="user-form__filter-col">
								<SelectPicker
									className="small-select"
									cleanable={true}
									searchable={true}
									data={selectFormattedSchoolsOptions}
									value={selectedSchool}
									onChange={(newValue) => {
										onChangeSelectedSchool(newValue);
										onChangePage(1);
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="section user-list-section">
				<div className="container">
					{!classes.length && <span>No classes added</span>}
					{!!classes.length && (
						<ClassesList isEditable={true} classes={classes} />
					)}
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

export { ClassesRoot };
