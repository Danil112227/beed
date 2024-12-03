import { SelectPicker } from "rsuite";

import { useUsersQuery, UserTypesEnum } from "@api/services/users";
import { useSchoolsQuery } from "@api/services/schools";
import { useGradesQuery } from "@api/services/grade";

import { Link } from "@components/common/Link";

import { UsersList, USER_TYPES } from "@features/users-list";
import { usePagination, Pagination } from "@features/pagination";
import { useSearch, Search } from "@features/search";
import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";
import { RoleGuard } from "@features/role-access";

import {
	useSelect,
	getSelectedValue,
	getSelectFormattedUserTypesValues,
	getSelectFormattedSchoolsValues,
	getSelectFormattedGradesValues,
} from "@features/select";

function UsersRoot() {
	const { page, offset, limit, onChangePage } = usePagination({});
	const {
		selectedValue: selectedUserType,
		onChangeSelectedValue: onChangeSelectedUserType,
	} = useSelect<UserTypesEnum>({});
	const {
		selectedValue: selectedSchool,
		onChangeSelectedValue: onChangeSelectedSchool,
	} = useSelect<number>({});
	const {
		selectedValue: selectedGrade,
		onChangeSelectedValue: onChangeSelectedGrade,
	} = useSelect<number>({});

	const {
		searchValue,
		submittedSearchValue,
		onChangeSearchValue,
		onSubmitSearchValue,
	} = useSearch();

	const usersResult = useUsersQuery({
		isEnabled: true,
		isPaginationEnabled: true,
		queryType: "users-short",
		queryKey: [
			"users-short",
			{ page, selectedUserType, selectedSchool, selectedGrade },
		],
		searchParams: {
			limit,
			offset,
			filter: getSelectedValue(selectedUserType, (value) => USER_TYPES[value!]),
			school_filter: getSelectedValue(selectedSchool),
			grade: getSelectedValue(selectedGrade),
		},
	});

	const usersSearchResult = useUsersQuery({
		isEnabled: !!submittedSearchValue.length,
		isPaginationEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short", { search: submittedSearchValue }],
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

	const gradesBySchoolResult = useGradesQuery({
		isEnabled: !!selectedSchool,
		queryType: "grades",
		queryKey: ["all-grades", { school: selectedSchool }],
		searchParams: {
			limit: 10000,
			school_filter: selectedSchool,
		},
	});

	const selectFormattedUserTypesOptions = getSelectFormattedUserTypesValues();
	const selectFormattedSchoolsOptions = getSelectFormattedSchoolsValues(
		schoolsResult?.results,
	);
	const selectFormattedGradesOptions = getSelectFormattedGradesValues(
		gradesBySchoolResult?.results,
	);

	if (!usersResult) {
		return null;
	}

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Users", path: "/users", isActive: false },
	];

	const { results: users, count: totalCount } = usersResult;

	return (
		<>
			<section className="section user-head-section">
				<div className="container">
					<Breadcrumbs breadcrumbs={breadcrumbs} />
					<h1 className="main-title">Users</h1>
					<div className="user-form">
						<div className="user-form__row">
							<Search
								schemaKey="users-short"
								searchResult={usersSearchResult}
								searchValue={searchValue}
								inputPlaceholder="Search user"
								submittedSearchValue={submittedSearchValue}
								onChangeSearchValue={onChangeSearchValue}
								onSubmitSearchValue={onSubmitSearchValue}
							/>
							<RoleGuard
								roles={[UserTypesEnum.TEACHER]}
								permissions={["can_create_users"]}
							>
								<Link
									to="/users/add"
									autoScrollable={true}
									nav={false}
									classes="btn primary"
								>
									Create user
								</Link>
							</RoleGuard>
						</div>
						<div className="user-form__filter-row">
							<div className="user-form__filter-col">
								<SelectPicker
									className="small-select"
									placeholder="User type"
									cleanable={true}
									searchable={false}
									data={selectFormattedUserTypesOptions}
									value={selectedUserType}
									onChange={(newValue) => {
										onChangeSelectedUserType(newValue);
										onChangePage(1);
									}}
								/>
							</div>
							<div className="user-form__filter-col">
								<SelectPicker
									className="small-select"
									placeholder="School"
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
							<div className="user-form__filter-col">
								{selectedSchool && (
									<SelectPicker
										className="small-select"
										placeholder="Grade"
										cleanable={true}
										searchable={true}
										data={selectFormattedGradesOptions}
										value={selectedGrade}
										onChange={(newValue) => {
											onChangeSelectedGrade(newValue);
											onChangePage(1);
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="section user-list-section">
				<div className="container">
					{!users.length && <span>No users added</span>}
					{!!users.length && <UsersList users={users} />}
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

export { UsersRoot };
