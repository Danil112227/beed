import { SetStateAction } from "react";

import { SelectValue } from "@features/select/hooks/useSelect";

export interface MultiSelectProps<T> {
	selectedValues: T[] | null;
	initialData: SelectValue<T>[];
	onChangeSelectedValues: (values: SetStateAction<T[] | null>) => void;
}
