import { SetStateAction } from "react";

import { SelectValue } from "@features/select/hooks/useSelect";

export interface MultiSelectValueProps<T> {
	initialData: SelectValue<T>[];
	item: T;
	onChangeSelectedValues: (values: SetStateAction<T[] | null>) => void;
}
