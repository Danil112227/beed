import { useState, useCallback } from "react";

import { useSearchParams } from "react-router-dom";

function useDialog() {
	const [isVisible, setIsVisible] = useState(false);

	const [_, setSearchParams] = useSearchParams();

	const openDialogHandler = useCallback(() => {
		setIsVisible(true);
	}, []);

	const closeDialogHandler = useCallback(
		(searchParamsToDelete?: string[]) => {
			setIsVisible(false);

			if (searchParamsToDelete) {
				setSearchParams((params) => {
					const keys = Array.from(params.keys());

					for (const key of keys) {
						if (searchParamsToDelete.includes(key)) {
							params.delete(key);
						}
					}

					return params;
				});
			}
		},
		[setSearchParams],
	);

	return {
		isVisible,
		onOpenDialog: openDialogHandler,
		onCloseDialog: closeDialogHandler,
	};
}

export { useDialog };
