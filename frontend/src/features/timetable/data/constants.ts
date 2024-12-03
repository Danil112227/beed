import { previousSunday, format, eachDayOfInterval, addDays } from "date-fns";

export const DURATION_LESSON_TIME = Array.from(
	{ length: 25 },
	(_, i) => 5 * i,
).slice(1);

const MINUTES_PER_HOUR = Array.from({ length: 12 }, (_, i) => 5 * i);

export const getTwelveHours = (type: string) => {
	const intervals = Array.from({ length: 13 }, (_, i) => i)
		.slice(1)
		.map((hour) =>
			MINUTES_PER_HOUR.map(
				(minutes) => `${hour}:${("0" + minutes).slice(-2)} ${type}`,
			),
		);

	return [intervals[intervals.length - 1], ...intervals.slice(0, -1)].flat();
};

export const TWENTY_FOUR_HOURS = Array.from(
	{ length: 24 },
	(_, i) => `${("0" + i).slice(-2)}`,
)
	.map((hour) =>
		MINUTES_PER_HOUR.map((minutes) => `${hour}:${("0" + minutes).slice(-2)}`),
	)
	.flat();

export const WEEKDAYS = Object.fromEntries(
	eachDayOfInterval({
		start: previousSunday(new Date()),
		end: addDays(previousSunday(new Date()), 6),
	})
		.map((day) => format(day, "EEEE"))
		.map((dayOfWeek, index) => [dayOfWeek, index]),
);
