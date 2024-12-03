import { SetStateAction } from "react"; 

export interface PaginationProps {
	perPageItemsCount?: number;
	currentPage: number;
	totalCount: number;
	from: number;
	to: number;
	onChangePage: (pageOrFn: number | SetStateAction<number>) => void
}