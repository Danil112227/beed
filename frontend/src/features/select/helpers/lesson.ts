import {
	DURATION_LESSON_TIME,
	getTwelveHours,
	TWENTY_FOUR_HOURS,
} from "@features/timetable";

import { SelectValue } from "../hooks/useSelect";

export const getSelectFormattedLessonDurationTimeValues =
	(): SelectValue<number>[] => {
		return DURATION_LESSON_TIME.map((time) => ({
			value: time,
			label: `${time} minutes`,
		}));
	};

export const getSelectFormattedLessonStartTimeValues =
	(): SelectValue<string>[] => {
		const ams = getTwelveHours("AM");
		const pms = getTwelveHours("PM");
		const mergedTwelveHours = [...ams, ...pms];
		const twentyFour = TWENTY_FOUR_HOURS;
		
		return twentyFour.map((hour, index) => ({
			value: hour,
			label: mergedTwelveHours[index],
		}));
	};
