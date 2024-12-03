import { useState, useEffect, Fragment } from "react";

import cn from "classnames";
import { SelectPicker } from "rsuite";
import { Calendar } from "primereact/calendar";

import { getSelectFormattedPeriodEventType } from "@features/select";

import { DEFAULT_PERIOD_STATE } from "@features/school-create/data/constants";

import { getListKey } from "@utils/list-key";

import { CreateSchoolFields } from "../SchoolCreateForm";
import { Period, PeriodsProps } from "./types";

import Plus from "@assets/vectors/blue-plus.svg?react";
import Del from "@assets/vectors/del-blue.svg?react";

function Periods({ onPeriodsChange, defaultPeriods, errors }: PeriodsProps) {
	const [periods, setPeriods] = useState<Period[]>(defaultPeriods);

	const selectFormattedSchoolOptions = getSelectFormattedPeriodEventType();

	const periodErrors = errors.periods;

	useEffect(() => {
		setPeriods(defaultPeriods);
	}, [defaultPeriods]);

	useEffect(() => {
		onPeriodsChange(periods as CreateSchoolFields["periods"]);
	}, [periods, onPeriodsChange]);

	const changeValueHandler = <T extends keyof Period>(
		key: T,
		periodIndex: number,
		value: Period[T],
	) => {
		setPeriods((prevState) => {
			const period = prevState[periodIndex];

			if (!period) {
				return [
					{
						...DEFAULT_PERIOD_STATE,
						[key]: value,
					},
				];
			}

			const updatedPeriod = {
				...period,
				[key]: value,
			};

			const stateCopy = prevState.slice();
			stateCopy.splice(periodIndex, 1, updatedPeriod);

			return stateCopy;
		});
	};

	const deletePeriodHandler = (periodIndex: number) => {
		setPeriods((prevState) => {
			const isLastPeriod = prevState.length < 2;

			if (isLastPeriod) {
				return [];
			}

			return prevState.filter((_, index) => index !== periodIndex);
		});
	};

	const addPeriodHandler = () => {
		setPeriods((prevState) => {
			if (!prevState.length) {
				return [DEFAULT_PERIOD_STATE, DEFAULT_PERIOD_STATE];
			}

			return [...prevState, DEFAULT_PERIOD_STATE];
		});
	};

	return (
		<div>
			<Fragment>
				<div className="main-form__opt">
					<span className="main-form__opt-title">Period 1</span>
					<button
						className="show-more"
						type="button"
						onClick={() => deletePeriodHandler(0)}
					>
						<span className="show-more__text">Delete</span>
						<div className="show-more__icon">
							<Del />
						</div>
					</button>
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": periodErrors?.[0]?.periodType,
					})}
				>
					<label htmlFor="user_timezone" className="main-form__label">
						Type of the event
					</label>
					<SelectPicker
						className="select"
						cleanable={true}
						searchable={false}
						data={selectFormattedSchoolOptions}
						value={periods?.[0]?.periodType}
						onChange={(value) => changeValueHandler("periodType", 0, value)}
					/>
					{periodErrors?.[0]?.periodType && (
						<p className="main-form__invalid-text">
							{periodErrors?.[0]?.periodType?.message}
						</p>
					)}
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": periodErrors?.[0]?.dates,
					})}
				>
					<label htmlFor="user_timezone" className="main-form__label">
						Dates
					</label>
					<Calendar
						minDate={new Date()}
						className="calendar input"
						dateFormat="dd.mm.yy"
						selectionMode="range"
						readOnlyInput
						hideOnRangeSelection
						value={periods?.[0]?.dates}
						onChange={(event) => {
							changeValueHandler("dates", 0, event.value);
						}}
					/>
					{periodErrors?.[0]?.dates && (
						<p className="main-form__invalid-text">
							{periodErrors?.[0]?.dates?.message}
						</p>
					)}
				</div>
			</Fragment>
			{periods.slice(1).map((period, index) => (
				<Fragment key={getListKey("period", index)}>
					<div className="main-form__opt">
						<span className="main-form__opt-title">Period {index + 2}</span>
						<button
							className="show-more"
							type="button"
							onClick={() => deletePeriodHandler(index + 1)}
						>
							<span className="show-more__text">Delete</span>
							<div className="show-more__icon">
								<Del />
							</div>
						</button>
					</div>
					<div
						className={cn("main-form__col", {
							"main-form__invalid": periodErrors?.[index + 1]?.periodType,
						})}
					>
						<label htmlFor="user_timezone" className="main-form__label">
							Type of the event
						</label>
						<SelectPicker
							className="select"
							cleanable={true}
							searchable={false}
							data={selectFormattedSchoolOptions}
							value={period.periodType}
							onChange={(value) =>
								changeValueHandler("periodType", index + 1, value)
							}
						/>
						{periodErrors?.[index + 1]?.periodType && (
							<p className="main-form__invalid-text">
								{periodErrors?.[index + 1]?.periodType?.message}
							</p>
						)}
					</div>
					<div
						className={cn("main-form__col", {
							"main-form__invalid": periodErrors?.[index + 1]?.dates,
						})}
					>
						<label htmlFor="user_timezone" className="main-form__label">
							Dates
						</label>
						<Calendar
							minDate={new Date()}
							className="calendar input"
							dateFormat="dd.mm.yy"
							selectionMode="range"
							readOnlyInput
							hideOnRangeSelection
							value={period.dates}
							onChange={(event) => {
								changeValueHandler("dates", index + 1, event.value);
							}}
						/>
						{periodErrors?.[index + 1]?.dates && (
							<p className="main-form__invalid-text">
								{periodErrors?.[index + 1]?.dates?.message}
							</p>
						)}
					</div>
				</Fragment>
			))}

			<button className="show-more" type="button" onClick={addPeriodHandler}>
				<span className="show-more__text">Add period</span>
				<div className="show-more__icon">
					<Plus />
				</div>
			</button>
		</div>
	);
}

export { Periods };
