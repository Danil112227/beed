import { SearchSchema } from "../Search";

export interface SearchResultsProps {
	submittedSearchValue: string;
	searchResultsCount: number;
	schemaKey: keyof SearchSchema;
	components: JSX.Element[] | null;
}
