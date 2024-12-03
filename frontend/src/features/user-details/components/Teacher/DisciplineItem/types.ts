import { DisciplineShort } from "@api/services/users";
import { DisciplineExtend, Teacher } from "@api/services/discipline";

export interface DisciplineItemProps {
	discipline: DisciplineShort | DisciplineExtend;
	teacher?: Teacher;
	invalidateQueryKeyOnSuccess: string;
	isDeleteActive: boolean;
}
