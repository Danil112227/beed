import { useEffect } from "react";

import cn from "classnames";

import { getListKey } from "@utils/list-key";

import {
	PER_PAGE_ITEMS_COUNT,
	PAGINATION_BUTTONS_COUNT,
} from "@features/pagination/data/constants";

import { PaginationProps } from "./types";

import Prev from "@assets/vectors/arrow-prev.svg?react";
import Next from "@assets/vectors/arrow-next.svg?react";
import Dots from "@assets/vectors/dots.svg?react";

function Pagination({
	totalCount,
	perPageItemsCount,
	from,
	to,
	currentPage,
	onChangePage,
}: PaginationProps) {
	const pagesCount = Math.ceil(
		totalCount / (perPageItemsCount || PER_PAGE_ITEMS_COUNT),
	);
	const pagesArr = Array.from(new Array(pagesCount).keys()).map(
		(index) => index + 1,
	);

	const recalculatedTo = to >= totalCount ? totalCount : to;

	let ellipsisPages: (number | "skip")[] = pagesArr;

	if (pagesArr.length > PAGINATION_BUTTONS_COUNT) {
		if (currentPage <= 3) {
			ellipsisPages = [1, 2, 3, "skip", pagesCount];
		}

		if (currentPage >= 3 && currentPage <= pagesCount) {
			ellipsisPages = [1, "skip", currentPage, "skip", pagesCount];
		}

		if (currentPage >= pagesCount - 3) {
			ellipsisPages = [1, "skip", pagesCount - 2, pagesCount - 1, pagesCount];
		}
	}

	useEffect(() => {
		if (currentPage > pagesCount) {
			onChangePage(pagesCount || 1);
		}
	}, [currentPage, pagesCount, onChangePage]);

	if (totalCount === 0) {
		return null;
	}

	return (
		<div className="user-pagination">
			<span className="user-pagination__info">
				Items {from + 1}-{recalculatedTo} of {totalCount}
			</span>

			<div className="pagination">
				<button
					className="pagination__button"
					disabled={from <= 0}
					onClick={() => onChangePage((prev) => prev - 1)}
				>
					<Prev />
				</button>
				{ellipsisPages.map((page, index) => {
					if (page === "skip") {
						return (
							<div
								key={getListKey("ellipsis", index)}
								className="pagination__button"
							>
								<Dots />
							</div>
						);
					}

					return (
						<button
							key={getListKey("page", page)}
							className={cn("pagination__button pagination__num", {
								active: page === currentPage,
							})}
							onClick={() => onChangePage(page)}
						>
							{page}
						</button>
					);
				})}
				<button
					className="pagination__button"
					disabled={to >= totalCount}
					onClick={() => onChangePage((prev) => prev + 1)}
				>
					<Next />
				</button>
			</div>
		</div>
	);
}

export { Pagination };
