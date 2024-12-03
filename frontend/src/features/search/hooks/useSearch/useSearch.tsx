import { useState, useCallback, ChangeEvent } from "react";

function useSearch() {
	const [searchValue, setSearchValue] = useState("");
	const [submittedSearchValue, setSubmittedSearchValue] = useState(searchValue);

	const changeSearchValue = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearchValue(event.target.value);
			setSubmittedSearchValue("");
		},
		[],
	);

	const submitSearchValueHandler = useCallback(() => {
		setSubmittedSearchValue(searchValue);
	}, [searchValue]);

	return {
		searchValue,
		submittedSearchValue,
		onChangeSearchValue: changeSearchValue,
		onSubmitSearchValue: submitSearchValueHandler,
	};
}

export { useSearch };
