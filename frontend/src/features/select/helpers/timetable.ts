import { format, getMonth, getDate } from "date-fns";

import { Period } from "@api/services/timetable";

import { SelectValue } from "../hooks/useSelect";

export const getSelectFormattedPeriodValues = (
	values?: Period[],
): SelectValue<number>[] => {
	if (!values) {
		return [];
	}

	return values.map((period) => {
		const startDate = new Date(period.start_date);
		const endDate = new Date(period.end_date);

		const startDateMonth = getMonth(startDate);
		const endDateMonth = getMonth(endDate);

		const year = format(startDate, "yyyy");

		let dateRangeText = `${getDate(startDate)} ${format(
			startDate,
			"MMM",
		)} - ${getDate(endDate)} ${format(endDate, "MMM")}, ${year}`;

		if (startDateMonth === endDateMonth) {
			dateRangeText = `${getDate(startDate)} - ${getDate(endDate)} ${format(
				startDate,
				"MMM",
			)}, ${year}`;
		}

		return {
			value: period.id,
			label: dateRangeText,
		};
	});
};
