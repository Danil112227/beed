import { UserTypeRadioProps } from "./types";

const UserTypeRadio = ({ field, value, label }: UserTypeRadioProps) => {
	return (
		<div className="main-form__radio radio">
			<label className="radio__label">
				<input
					{...field}
					type="radio"
					value={value}
					checked={field.value === value}
					onChange={() => {
						field.onChange(value);
					}}
					className="radio__input"
				/>
				<div className="radio__circle"></div>
				<span className="radio__text">{label}</span>
			</label>
		</div>
	);
};

export { UserTypeRadio };
