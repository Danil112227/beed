import { UsersListQueryType } from "@api/services/users";
import { GradeListQueryType } from "@api/services/grade";
import { SchoolsListQueryType } from "@api/services/schools/types";

export interface SearchSchema
	extends UsersListQueryType,
		GradeListQueryType,
		SchoolsListQueryType {}

export interface SearchProps<T extends keyof SearchSchema> {
	schemaKey: T;
	searchResult?: SearchSchema[T];
	searchValue: string;
	submittedSearchValue: string;
	inputPlaceholder: string;
	onChangeSearchValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmitSearchValue: () => void;
}
