import { useCallback, useMemo, useState } from "react";

import Calendar from "react-calendar";
import { useParams } from "react-router-dom";

import { useSchoolsQuery, PeriodTypesEnum } from "@api/services/schools";

import {
	format,
	eachMonthOfInterval,
	getYear,
	isWithinInterval,
	set,
	isWeekend,
} from "date-fns";

import { getListKey } from "@utils/list-key";

import { Period } from "./types";

import Prev from "@assets/vectors/arrow-prev.svg?react";
import Next from "@assets/vectors/arrow-next.svg?react";

import "./SchoolCalendar.styles.scss";

function SchoolCalendar() {
	const { id } = useParams();

	const [year, setYear] = useState(getYear(new Date()));

	const months = eachMonthOfInterval({
		start: new Date(year - 1, 9, 1).setMinutes(new Date().getTimezoneOffset()),
		end: new Date(year, 8, 1).setMinutes(new Date().getTimezoneOffset()),
	});

	const schoolDetailsResult = useSchoolsQuery({
		isEnabled: !!id,
		queryType: "school-details",
		queryKey: ["school-details", { schoolId: id }],
		payload: { id: id! },
	});

	const [dayOffPeiods, workDayPeriods] = useMemo(() => {
		if (!schoolDetailsResult || !schoolDetailsResult?.periods) {
			return [[], []];
		}

		const dayOffs: Period[] = [];
		const workDays: Period[] = [];

		const { periods } = schoolDetailsResult;

		const formattedPeiods = periods.map((period) => ({
			...period,
			start_date: set(new Date(period.start_date), {
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			}),
			end_date: set(new Date(period.end_date), {
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			}),
		}));

		formattedPeiods.forEach((period) => {
			if (period.type === PeriodTypesEnum.DAY_OFF) {
				dayOffs.push(period);
				return;
			}

			workDays.push(period);
		});

		return [dayOffs, workDays];
	}, [schoolDetailsResult]);

	const tileClassNameHandler = useCallback(
		({ date }: { date: Date }) => {
			const isDayOff = dayOffPeiods.some((period) =>
				isWithinInterval(date, {
					start: period.start_date,
					end: period.end_date,
				}),
			);

			const isWorkDay = workDayPeriods.some((period) =>
				isWithinInterval(date, {
					start: period.start_date,
					end: period.end_date,
				}),
			);

			const isWeekendDay = isWeekend(date) && !isWorkDay;

			if (isDayOff || isWeekendDay) {
				return "day-off";
			}

			return "work-day";
		},
		[dayOffPeiods, workDayPeriods],
	);

	const nextClickHandler = useCallback(() => {
		setYear((prevState) => prevState + 1);
	}, []);

	const prevClickHandler = useCallback(() => {
		setYear((prevState) => prevState - 1);
	}, []);

	const currentYearClickHandler = useCallback(() => {
		setYear(getYear(new Date()));
	}, []);

	if (!schoolDetailsResult || !id) {
		return null;
	}

	return (
		<>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<span>School calendar</span>

				<div style={{ display: "flex" }}>
					<div className="nav-arrows">
						<button
							className="nav-arrow nav-arrow-prev"
							onClick={prevClickHandler}
						>
							<Prev />
						</button>
						<button
							className="nav-arrow nav-arrow-next"
							onClick={nextClickHandler}
						>
							<Next />
						</button>
					</div>
					<button className="nav-arrow" onClick={currentYearClickHandler}>
						Current year
					</button>
				</div>
			</div>
			<div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
				{months.map((date, index) => (
					<Calendar
						key={getListKey("school-calendar", index)}
						activeStartDate={date}
						prev2Label={null}
						next2Label={null}
						prevLabel={null}
						nextLabel={null}
						minDetail="month"
						// locale="en-EN"
						formatMonthYear={(_, date) => format(date, "MMMM")}
						formatShortWeekday={(_, date) => format(date, "E")}
						tileClassName={tileClassNameHandler}
					/>
				))}
			</div>
		</>
	);
}

export { SchoolCalendar };
