import { useState, useRef, useEffect, useCallback } from "react";

import { useOnClickOutside } from "usehooks-ts";

import { UserSearchItem } from "../SearchItemComponents/UserSearch/UserSearchItem";
import { ClassSearchItem } from "../SearchItemComponents/ClassSearch/ClassSearchItem";
import { SchoolSearchItem } from "../SearchItemComponents/SchoolSearch/SchoolSearchItem";
import { SearchResults } from "../SearchResults";

import { getListKey } from "@utils/list-key";

import { SearchProps, SearchSchema } from "./types";

import Srch from "@assets/vectors/search.svg?react";

function Search<T extends keyof SearchSchema>({
	searchValue,
	schemaKey,
	searchResult,
	submittedSearchValue,
	inputPlaceholder,
	onChangeSearchValue,
	onSubmitSearchValue,
}: SearchProps<T>) {
	const [isSearchVisible, setIsSearchVisible] = useState(false);

	const searchRef = useRef<HTMLDivElement>(null);
	const inputSearchRef = useRef<HTMLInputElement>(null);

	let components: JSX.Element[] | null = null;

	if (!searchResult) {
		components = null;
	} else if (schemaKey === "users-short") {
		const result = searchResult as SearchSchema["users-short"];
		const list = result.results;

		components = list.map((item) => (
			<UserSearchItem
				key={getListKey("search-user", item.id)}
				id={item.id}
				firstName={item.first_name}
				lastName={item.last_name}
				patronymic={item.Patronymic}
				type={item.type}
			/>
		));
	} else if (schemaKey === "grades") {
		const result = searchResult as SearchSchema["grades"];
		const list = result.results;

		components = list.map((item) => (
			<ClassSearchItem
				key={getListKey("search-grade", item.id)}
				id={item.id}
				className={item.name}
				schoolName={item.school.name}
			/>
		));
	} else if (schemaKey === "schools") {
		const result = searchResult as SearchSchema["schools"];
		const list = result.results;

		components = list.map((item) => (
			<SchoolSearchItem
				key={getListKey("search-school", item.id)}
				id={item.id}
				schoolName={item.name}
			/>
		));
	}

	const isSearchBtnDisabled = !searchValue.length;

	const focusSearchHandler = () => {
		setIsSearchVisible(true);
	};

	const clickOutsideSearchHandler = () => {
		if (inputSearchRef) {
			inputSearchRef.current?.blur();
		}
		setIsSearchVisible(false);
	};

	const keyboardActionsHandler = useCallback(
		(event: KeyboardEvent) => {
			switch (true) {
				case event.code === "Enter":
					if (isSearchBtnDisabled) {
						return;
					}

					onSubmitSearchValue();
					return;
				case event.code === "Escape":
					clickOutsideSearchHandler();
					return;
			}
		},
		[isSearchBtnDisabled, onSubmitSearchValue],
	);

	useEffect(() => {
		window.addEventListener("keydown", keyboardActionsHandler);
		return () => window.removeEventListener("keydown", keyboardActionsHandler);
	}, [keyboardActionsHandler]);

	useOnClickOutside(searchRef, clickOutsideSearchHandler);

	return (
		<>
			<div className="user-form__input-wrap" ref={searchRef}>
				<input
					ref={inputSearchRef}
					type="text"
					className="user-form__input"
					placeholder={inputPlaceholder}
					value={searchValue}
					onChange={onChangeSearchValue}
					onFocus={focusSearchHandler}
				/>
				<button
					className="user-form__search-btn"
					disabled={isSearchBtnDisabled}
					onClick={onSubmitSearchValue}
				>
					<Srch />
				</button>

				{isSearchVisible && (
					<SearchResults
						schemaKey={schemaKey}
						submittedSearchValue={submittedSearchValue}
						searchResultsCount={searchResult?.results.length || 0}
						components={components}
					/>
				)}
			</div>
		</>
	);
}

export { Search };
