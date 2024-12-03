import { DisciplineShort } from "@api/services/users";
import { Teacher, DisciplineExtend } from "@api/services/discipline";

export interface DisciplineListProps {
	isCreatable: boolean;
	gradeId?: number;
	disciplines: DisciplineShort[] | DisciplineExtend[];
	teacher?: Teacher;
	invalidateQueryKeyOnSuccess: string;
	isDeleteActive: boolean;
}
