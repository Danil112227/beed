import { addLocale } from "primereact/api";

export const registerPrimeLocales = () =>
	addLocale("ru", {
		firstDayOfWeek: 1,
	});
