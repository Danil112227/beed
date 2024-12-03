import { PeriodTypesEnum } from "@api/services/schools";

export interface Period {
	type: PeriodTypesEnum;
	start_date: Date;
	end_date: Date;
}
