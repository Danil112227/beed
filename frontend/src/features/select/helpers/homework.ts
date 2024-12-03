import { SelectValue } from "../hooks/useSelect";

import { HomeworkTypesEnum, HomeworkStatusEnum } from "@api/services/homework";

export const getSelectFormattedHomeworkType =
	(): SelectValue<HomeworkTypesEnum>[] => {
		return Object.entries(HomeworkTypesEnum)
			.filter(([_, value]) => typeof value === "number")
			.map(([key, value]) => {
				return {
					value: value as HomeworkTypesEnum,
					label: key[0] + key.slice(1).toLowerCase(),
				};
			});
	};

export const getSelectFormattedHomeworkStatus =
	(): SelectValue<HomeworkStatusEnum>[] => {
		return Object.entries(HomeworkStatusEnum)
			.filter(([_, value]) => typeof value === "number")
			.map(([key, value]) => {
				const formattedKey = key
					.split("_")
					.map((segment) => segment[0] + segment.slice(1).toLowerCase());
				return {
					value: value as HomeworkStatusEnum,
					label: formattedKey.join(" "),
				};
			});
	};
