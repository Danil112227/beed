import { DisciplineExtend } from "@api/services/discipline";

import { SelectValue } from "../hooks/useSelect";

export const getSelectFormattedDisciplineValues = (
	values?: DisciplineExtend[],
): SelectValue<number>[] => {
	if (!values) {
		return [];
	}

	return values.map((discipline) => {
		return {
			value: discipline.id,
			label: discipline.name,
		};
	});
};
