import timezone from "countries-and-timezones";

import { SelectValue } from "../hooks/useSelect";

const EXCLUDE_COUNTRIES_REG_EXPS = [/GMT/];

export const getSelectFormattedTimezoneValues = (): SelectValue<string>[] => {
	const timezones = timezone.getAllTimezones();

	const dedupedTimezoneLabels: string[] = [];

	const formattedTimezones = Object.values(timezones)
		.map((timezone, index) => {
			const isCountryExist = timezone.name.includes("/");

			if (!isCountryExist) {
				return null;
			}

			const formattedCountry = timezone.name.split("/")[1].replace(/_/g, " ");
			const isExcludeCountry = EXCLUDE_COUNTRIES_REG_EXPS.some((check) =>
				check.test(formattedCountry),
			);

			if (isExcludeCountry) {
				return null;
			}

			const utcOffsetHours = timezone.dstOffsetStr.split(":")[0];
			const formattedUTCHours =
				utcOffsetHours[1] === "0"
					? utcOffsetHours.replace("0", "")
					: utcOffsetHours;

			return {
				value: `unique-key-${index}|${formattedUTCHours}`,
				label: `${formattedCountry} UTC ${formattedUTCHours}`,
			};
		})
		.filter((item) => Boolean(item)) as SelectValue<string>[];

	return formattedTimezones.filter((timezone) => {
		if (dedupedTimezoneLabels.includes(timezone.label)) {
			return false;
		}

		dedupedTimezoneLabels.push(timezone.label);
		return true;
	});
};
