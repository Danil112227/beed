import { MouseEvent } from "react";

import { MultiSelectValueProps } from "./types";

import Close from "@assets/vectors/close.svg?react";

import "./MultiSelectValue.styles.scss";

function MultiSelectValue<T>({
	initialData,
	item,
	onChangeSelectedValues,
}: MultiSelectValueProps<T>) {
	const fountValue = initialData.find((i) => i.value === item);

	const clickHandler = (
		event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
	) => {
		event.preventDefault();

		onChangeSelectedValues((prevState) => {
			if (!prevState) {
				return prevState;
			}

			return prevState.filter((item) => item !== fountValue?.value);
		});
	};

	return (
		<div className="selected-col">
			<div className="selected-item">
				<span className="selected-item__name">{fountValue?.label}</span>
				<button className="selected-item__del" onClick={clickHandler}><Close /></button>
			</div></div>
	);
}

export { MultiSelectValue };
