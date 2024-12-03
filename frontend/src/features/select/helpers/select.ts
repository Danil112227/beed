export const getSelectedValue = <T>(
	value: T,
	formatCallback?: (value: T) => unknown,
) => {
	if (value === null) {
		return null;
	}

	if (formatCallback && value !== null) {
		return formatCallback(value);
	}

	return value;
};
