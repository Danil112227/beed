import { useState, useCallback, SetStateAction } from "react";

import { UseSelectProps } from "./types";

function useSelect<T>({ defaultSelectedValue }: UseSelectProps<T>) {
	const [selectedValue, setSelectedValue] = useState<T | null>(
		defaultSelectedValue || null,
	);

	const changeSelectedValueHandler = useCallback(
		(value: SetStateAction<T | null>) => {
			setSelectedValue(value);
		},
		[],
	);

	return { selectedValue, onChangeSelectedValue: changeSelectedValueHandler };
}

export { useSelect };
