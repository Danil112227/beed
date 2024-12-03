import { SetStateAction } from "react";

import { SelectValue } from "@features/select/hooks/useSelect";

export interface MultiSelectMenuItemProps<T> {
	selectedValues: T[] | null;
	item: SelectValue<T>;
	onChangeSelectedValues: (values: SetStateAction<T[] | null>) => void;
}
