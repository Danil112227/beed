import { SelectValue } from "../hooks/useSelect";

import { Grade } from "@api/services/grade";

export const getSelectFormattedGradesValues = (
	values?: Grade[],
): SelectValue<number>[] => {
	if (!values) {
		return [];
	}

	return values.map((grade) => ({
		value: grade.id,
		label: grade.name,
	}));
};
