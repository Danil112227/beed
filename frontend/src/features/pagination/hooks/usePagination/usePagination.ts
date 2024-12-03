import { useState, SetStateAction } from "react";

import { PER_PAGE_ITEMS_COUNT } from "@features/pagination/data/constants";

import { UsePaginationProps } from "./types";

function usePagination({ perPageItemsCount }: UsePaginationProps) {
	const [page, setPage] = useState(1);

	const offset = (page - 1) * (perPageItemsCount || PER_PAGE_ITEMS_COUNT);
	const limit = perPageItemsCount || PER_PAGE_ITEMS_COUNT;

	const changePageHandler = (pageOrFn: number | SetStateAction<number>) => {
		setPage(pageOrFn);
	};

	return {
		page,
		offset,
		limit,
		onChangePage: changePageHandler,
	};
}

export { usePagination };
