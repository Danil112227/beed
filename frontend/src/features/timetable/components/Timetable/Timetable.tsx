import { useCallback, useMemo, useState, useEffect } from "react";

import { Calendar as DatePicker } from "primereact/calendar";
import {
	Calendar,
	Views,
	dateFnsLocalizer,
	EventProps,
	SlotInfo,
} from "react-big-calendar";
import {
	format,
	parse,
	startOfWeek,
	getDay,
	addWeeks,
	addDays,
	subWeeks,
	getMonth,
	getDate,
	previousMonday,
	previousDay,
	nextDay,
	isThisWeek,
	startOfDay,
	set,
	addMinutes,
	endOfDay,
	getHours,
	Day,
	getYear,
	getMinutes,
	isMonday,
} from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import enUS from "date-fns/locale/en-US";
import { SelectPicker } from "rsuite";
import cn from "classnames";

import { useLessonQuery } from "@api/services/timetable";

import { AddMasterLessonDialog, useDialog } from "@features/dialog";
import { useSelect, getSelectFormattedPeriodValues } from "@features/select";

import { RegularEvent } from "../RegularEvent";
import { MasterRegularEvent } from "../MasterRegularEvent";
import { TimeGutterHeader } from "../TimeGutterHeader";

import { WEEKDAYS } from "@features/timetable/data/constants";

import { TimetableEvent, TimetableProps } from "./types";
import { Nullable } from "@utils/types";

import Prev from "@assets/vectors/arrow-prev.svg?react";
import Next from "@assets/vectors/arrow-next.svg?react";

import "./Timetable.styles.scss";

const locales = {
	"en-US": enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
	getDay,
	locales,
});

function Timetable({
	isTimetableTemplate,
	externalUserId,
	isTimetableTemplateEditable,
}: TimetableProps) {
	const { classId, id } = useParams();
	const navigate = useNavigate();

	const [date, setDate] = useState<Date>(new Date());

	const currentDate = useMemo(() => new Date(), []);

	const {
		selectedValue: selectedPeriod,
		onChangeSelectedValue: onChangeSelectedPeriod,
	} = useSelect<number>({});

	const {
		isVisible: isAddMasterLessonDialogVisible,
		onOpenDialog: onOpenAddMasterLessonDialog,
		onCloseDialog: onCloseAddMasterLessonDialog,
	} = useDialog();

	const formattedDate = useMemo(
		() => format(isMonday(date) ? date : previousMonday(date), "yyyy-MM-dd"),
		[date],
	);

	const lessonsResult = useLessonQuery({
		isEnabled: !!classId || !!id || !!externalUserId,
		queryType: "lessons",
		isKeepPreviousData: true,
		queryKey: [
			"lessons",
			{ startDate: formattedDate, grade: classId, user: id || externalUserId },
		],
		searchParams: {
			start_date: formattedDate,
			grade: classId,
			user: id || externalUserId,
		},
	});

	const masterLessonsResult = useLessonQuery({
		isEnabled: !!selectedPeriod && isTimetableTemplateEditable,
		queryType: "master-lessons",
		queryKey: ["master-lessons", { period: selectedPeriod }],
		searchParams: {
			limit: 10000,
			period: selectedPeriod,
		},
	});

	const periodsResult = useLessonQuery({
		isEnabled: !!classId,
		queryType: "periods",
		queryKey: ["periods", { grade: classId }],
		searchParams: {
			limit: 10000,
			grade: classId,
		},
	});

	useEffect(() => {
		if (!periodsResult || selectedPeriod) {
			return;
		}

		const { results } = periodsResult;

		const foundClosestPeriodWithinDates = results.find((period) => {
			const startDate = new Date(period.start_date);
			const endDate = new Date(period.end_date);

			return startDate <= currentDate && endDate >= currentDate;
		});

		if (foundClosestPeriodWithinDates) {
			onChangeSelectedPeriod(foundClosestPeriodWithinDates.id);
			return;
		}

		const foundStartClosesPeriod = results.find((period) => {
			const startDate = new Date(period.start_date);

			return startDate >= currentDate;
		});

		if (foundStartClosesPeriod) {
			onChangeSelectedPeriod(foundStartClosesPeriod.id);
			return;
		}

		const foundEndClosesPeriod = results.find((period) => {
			const endDate = new Date(period.end_date);

			return endDate <= currentDate;
		});

		if (foundEndClosesPeriod) {
			onChangeSelectedPeriod(foundEndClosesPeriod.id);
		}
	}, [periodsResult, selectedPeriod, currentDate, onChangeSelectedPeriod]);

	const events: TimetableEvent[] = useMemo(() => {
		if (isTimetableTemplate && masterLessonsResult) {
			const { results: masterEvents } = masterLessonsResult;

			return masterEvents.map((event) => {
				const dayOfWeek = event.day_of_week;
				const durationMinutes = event.duration;
				const numberDayOfWeek = WEEKDAYS[dayOfWeek];
				const [startHours, startMinutes] = event.start_time.split(":");

				const date = previousDay(currentDate, numberDayOfWeek);
				const nextDate = nextDay(currentDate, numberDayOfWeek as Day);
				const isThisDay =
					!isThisWeek(date, { weekStartsOn: 1 }) &&
					!isThisWeek(nextDate, { weekStartsOn: 1 });

				let eventDate = isThisWeek(date, { weekStartsOn: 1 })
					? startOfDay(date)
					: startOfDay(nextDate);
				if (isThisDay) {
					eventDate = startOfDay(currentDate);
				}

				const startDate = set(eventDate, {
					hours: +startHours,
					minutes: +startMinutes,
				});
				const endDate = addMinutes(startDate, durationMinutes);

				return {
					resourceId: event.id,
					start: startDate,
					end: endDate,
					data: {
						type: "master-regular",
						masterLessonId: event.id,
						title: event.title,
						teacherName: event.discipline.teacher.first_name,
					},
				};
			});
		}

		if (!lessonsResult) {
			return [];
		}

		const { results: events } = lessonsResult;

		return events.map((event) => ({
			resourceId: event.id,
			start: new Date(event.start_time),
			end: new Date(event.end_time),
			data: {
				type: "regular",
				gradeId: event.grade.id,
				lessonId: event.id,
				title: event.title,
				teacherName: event.discipline.teacher.first_name,
			},
		}));
	}, [lessonsResult, masterLessonsResult, isTimetableTemplate, currentDate]);

	const filteredEvents = useMemo(() => {
		const startDate = set(isMonday(date) ? date : previousMonday(date), {
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});
		const endDate = endOfDay(addDays(startDate, 6));

		return events.filter((event) => {
			return (
				event.start &&
				startDate <= event.start &&
				event.end &&
				endDate >= event.end
			);
		});
	}, [date, events]);

	const [minTime, maxTime] = useMemo(() => {
		let min: unknown = null;
		let max: unknown = null;

		filteredEvents.forEach((event) => {
			if (!event.start || !event.end) {
				return;
			}

			const year = getYear(currentDate);
			const month = getMonth(currentDate);
			const day = getDay(currentDate);

			const formattedStart = set(event.start, {
				year: year,
				month: month,
				date: day,
			});

			const formattedEnd = set(event.end, {
				year: year,
				month: month,
				date: day,
			});

			if (!min || formattedStart < min) {
				min = formattedStart;
			}
			if (!max || formattedEnd > max) {
				max = formattedEnd;
			}
		});

		const timeStartOfDay =
			min instanceof Date &&
			set(new Date(min), {
				hours: 1,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			});

		const gapMinHours =
			timeStartOfDay && min instanceof Date && timeStartOfDay > min ? 0 : 1;

		const currentMinDate =
			min instanceof Date &&
			set(new Date(), {
				hours: getHours(min) - gapMinHours,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			});

		const timeEndOfDay =
			min instanceof Date &&
			set(new Date(min), {
				hours: 23,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			});

		const gapMaxHours =
			timeEndOfDay && max instanceof Date && timeEndOfDay < max ? 0 : 1;
		const additionalMaxHours =
			max instanceof Date && getMinutes(max) > 0 ? 1 : 0;

		const currentMaxDate =
			max instanceof Date &&
			set(new Date(), {
				hours: getHours(max) + additionalMaxHours + gapMaxHours,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			});

		if (currentMinDate && currentMaxDate) {
			return [currentMinDate, currentMaxDate];
		}

		return [undefined, undefined];
	}, [currentDate, filteredEvents]);

	const prevClickHandler = useCallback(() => {
		setDate((prevState) => subWeeks(prevState, 1));
	}, []);

	const nextClickHandler = useCallback(() => {
		setDate((prevState) => addWeeks(prevState, 1));
	}, []);

	const todayClickHandler = useCallback(() => {
		setDate(currentDate);
	}, [currentDate]);

	const changeDateHandler = useCallback((date?: Nullable<Date>) => {
		if (!date) {
			return;
		}
		setDate(date);
	}, []);

	const components = useMemo(
		() => ({
			event: ({ event }: EventProps<TimetableEvent>) => {
				const eventData = event.data;

				if (eventData?.type === "regular") {
					const { title, teacherName, lessonId, gradeId } = eventData;

					return (
						<RegularEvent
							gradeId={gradeId}
							lessonId={lessonId}
							title={title}
							teacherName={teacherName}
						/>
					);
				}

				if (eventData?.type === "master-regular") {
					const { title, teacherName, masterLessonId } = eventData;

					return (
						<MasterRegularEvent
							masterLessonId={masterLessonId}
							title={title}
							teacherName={teacherName}
						/>
					);
				}

				return null;
			},
			timeGutterHeader: TimeGutterHeader,
		}),
		[],
	);

	const selectSlotHandler = useCallback(
		(slotInfo: SlotInfo) => {
			const { action, start } = slotInfo;

			if (action === "doubleClick") {
				return;
			}

			const dayOfWeek = format(start, "EEEE");
			const startTime = format(start, "HH:mm");

			navigate(
				`?period=${selectedPeriod}&dayOfWeek=${dayOfWeek}&startTime=${startTime}`,
			);
			onOpenAddMasterLessonDialog();

			return false;
		},
		[selectedPeriod, onOpenAddMasterLessonDialog, navigate],
	);

	const dayFormat = isTimetableTemplate ? "EEEE" : "E, MMM d";

	const selectFormattedPeriodOptions = getSelectFormattedPeriodValues(
		periodsResult?.results,
	);

	const dateRangetText = useMemo(() => {
		let startDate = isMonday(date) ? date : previousMonday(date);
		let endDate = addDays(startDate, 6);

		if (isTimetableTemplate) {
			const foundPeriod = periodsResult?.results.find(
				(period) => period.id === selectedPeriod,
			);

			if (foundPeriod) {
				startDate = new Date(foundPeriod.start_date);
				endDate = new Date(foundPeriod.end_date);
			} else {
				return "";
			}
		}

		const startDateMonth = getMonth(startDate);

		const endDateMonth = getMonth(endDate);

		if (startDateMonth === endDateMonth) {
			return `${getDate(startDate)} - ${getDate(endDate)} ${format(
				startDate,
				"MMMM",
			)}`;
		}

		return `${getDate(startDate)} ${format(startDate, "MMMM")} - ${getDate(
			endDate,
		)} ${format(endDate, "MMMM")}`;
	}, [date, isTimetableTemplate, periodsResult, selectedPeriod]);

	return (
		<>
			<div className="timetable-head">
				<div className="timetable-head__date">{dateRangetText}</div>
				{!isTimetableTemplate && (
					<>
						<div className="timetable-head__date-picker">
							<DatePicker
								dateFormat="d M, yy"
								className="calendar input"
								value={date}
								onChange={(e) => changeDateHandler(e.value)}
							/>
						</div>
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
						<button className="nav-arrow" onClick={todayClickHandler}>
							Today
						</button>
					</>
				)}
				{isTimetableTemplate && (
					<div className="timetable-head__date-picker">
						<SelectPicker
							className="select"
							cleanable={false}
							searchable={false}
							data={selectFormattedPeriodOptions}
							value={selectedPeriod}
							onChange={(newValue) => onChangeSelectedPeriod(newValue)}
						/>
					</div>
				)}
			</div>
			{(!!filteredEvents.length || isTimetableTemplate) && (
				<Calendar
					className={cn({ "timetable-template": isTimetableTemplate })}
					style={{ marginBottom: "100px" }}
					dayLayoutAlgorithm={"no-overlap"}
					defaultDate={currentDate}
					date={date}
					min={isTimetableTemplate ? undefined : minTime}
					max={isTimetableTemplate ? undefined : maxTime}
					onNavigate={setDate}
					defaultView={Views.WEEK}
					views={[Views.WEEK]}
					events={events}
					localizer={localizer}
					components={components}
					formats={{
						dayFormat: (date, culture, localizer) =>
							localizer!.format(date, dayFormat, culture),
						timeGutterFormat: (date, culture, localizer) =>
							localizer!.format(date, "h aaaa", culture),
					}}
					toolbar={false}
					timeslots={4}
					step={15}
					selectable={"ignoreEvents"}
					onSelectSlot={
						isTimetableTemplate && selectedPeriod ? selectSlotHandler : () => {}
					}
				/>
			)}
			{!filteredEvents.length && !isTimetableTemplate && (
				<span>No lessons exists for current interval</span>
			)}

			<AddMasterLessonDialog
				isVisible={isAddMasterLessonDialogVisible}
				onClose={() =>
					onCloseAddMasterLessonDialog(["dayOfWeek", "period", "startTime"])
				}
			/>
		</>
	);
}

export { Timetable };
