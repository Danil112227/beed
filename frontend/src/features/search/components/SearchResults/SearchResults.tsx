import { SEARCH_TITLE } from "@features/search/data/constants";

import { SearchResultsProps } from "./types";

function SearchResults({
	schemaKey,
	searchResultsCount,
	submittedSearchValue,
	components,
}: SearchResultsProps) {
	return (
		<div className="search">
			<div className="search__head">
				{!!searchResultsCount && !!submittedSearchValue.length && (
					<>
						<div className="search__row">
							<span className="search__text">Search for</span>
							<span className="search__input-text">
								"{submittedSearchValue}"
							</span>
						</div>

						<div className="search__text search__result-text">
							{searchResultsCount} results
						</div>
					</>
				)}
				{(!searchResultsCount || !submittedSearchValue.length) && (
					<div className="search__row">
						<span className="search__text">
							Type search phrase and click search button or press "Enter"
						</span>
					</div>
				)}
			</div>
			<div className="search__scroll">
				{!!searchResultsCount && !!submittedSearchValue.length && (
					<div className="search__type">{SEARCH_TITLE[schemaKey]}</div>
				)}
				<div className="search__results">
					{components &&
						!!submittedSearchValue.length &&
						!!components.length && (
						<ul className="search__result-list">{components}</ul>
					)}
					{!components ||
						(!components.length && (
							<div className="search__nofound">No results found</div>
						))}
				</div>
			</div>
		</div>
	);
}

export { SearchResults };
