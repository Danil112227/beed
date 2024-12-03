import { useState, useEffect } from "react";

import { CheckPicker } from "rsuite";

import { MultiSelectMenuItem } from "../MultiSelectMenuItem";
import { MultiSelectValue } from "../MultiSelectValue";

import { getListKey } from "@utils/list-key";

import { SelectValue } from "@features/select/hooks/useSelect";
import { MultiSelectProps } from "./types";

function MultiSelect<T>({
	selectedValues,
	initialData,
	onChangeSelectedValues,
}: MultiSelectProps<T>) {
	const [data, setData] = useState<SelectValue<T>[]>([]);

	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	const changeValueHandler = (value: T[]) => {
		onChangeSelectedValues(value);
	};

	const changeSearchValueHandler = (searchTerm: string) => {
		setData(
			initialData.filter((data) =>
				data.label.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	};

	return (
		<CheckPicker
			placement="autoVertical"
			className="select"
			menuClassName="select__menu"
			countable={false}
			cleanable={false}
			data={data}
			value={selectedValues || undefined}
			onChange={changeValueHandler}
			onSearch={changeSearchValueHandler}
			renderMenu={() => {
				return data.map((item) => (
					<MultiSelectMenuItem
						key={getListKey("select-item", item.value)}
						selectedValues={selectedValues}
						item={item}
						onChangeSelectedValues={onChangeSelectedValues}
					/>
				));
			}}
			renderValue={(values) => {
				return (
					<div className="selected-row">
						{values.map((item) => (
							<MultiSelectValue
								key={getListKey("selected-item", item)}
								initialData={initialData}
								item={item}
								onChangeSelectedValues={onChangeSelectedValues}
							/>
						))}
					</div>
				);
			}}
		/>
	);
}

export { MultiSelect };
