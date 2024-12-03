import { FieldErrors } from "react-hook-form";

import { PeriodTypesEnum } from "@api/services/schools";

import { Nullable } from "@utils/types";
import { CreateSchoolFields } from "../SchoolCreateForm";

export interface Period {
	periodType: Nullable<PeriodTypesEnum>;
	dates?: Nullable<(Date | null)[]>;
}

export interface PeriodsProps {
	defaultPeriods: CreateSchoolFields["periods"];
	errors: FieldErrors<CreateSchoolFields>;
	onPeriodsChange: (periods: CreateSchoolFields["periods"]) => void;
}
