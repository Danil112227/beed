import { MouseEvent } from "react";

import cn from "classnames";

import { MultiSelectMenuItemProps } from "./types";

function MultiSelectMenuItem<T>({
	selectedValues,
	item,
	onChangeSelectedValues,
}: MultiSelectMenuItemProps<T>) {
	const clickHandler = (
		event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	) => {
		event.preventDefault();

		if (!selectedValues) {
			return;
		}

		if (selectedValues.includes(item.value)) {
			onChangeSelectedValues((prevState) => {
				if (!prevState) {
					return prevState;
				}

				return prevState.filter((i) => i !== item.value);
			});
			return;
		}

		onChangeSelectedValues((prevState) => {
			if (!prevState) {
				return prevState;
			}

			return [...prevState, item.value];
		});
	};

	return (
		<button
			type="button"
			className={cn("rs-picker-select-menu-item", {
				active: selectedValues?.includes(item.value)
			})}
			onClick={clickHandler}
		>
			{item.label}
		</button>
	);
}

export { MultiSelectMenuItem };
