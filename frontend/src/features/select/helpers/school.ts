import { SelectValue } from "../hooks/useSelect";

import { School, PeriodTypesEnum } from "@api/services/schools";

export const getSelectFormattedSchoolsValues = (
	values?: School[],
): SelectValue<number>[] => {
	if (!values) {
		return [];
	}

	return values.map((school) => ({
		value: school.id,
		label: school.name,
	}));
};

export const getSelectFormattedPeriodEventType =
	(): SelectValue<PeriodTypesEnum>[] => {
		return Object.entries(PeriodTypesEnum).map(([_, value]) => {
			return {
				value,
				label: value[0].toUpperCase() + value.slice(1),
			};
		});
	};
