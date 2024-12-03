import { getListKey } from "@utils/list-key";

import { ClassItem } from "../ClassItem";

import { ClassesListProps } from "./types";

function ClassesList({ classes, isEditable }: ClassesListProps) {
	return (
		<div className="user-list">
			{classes.map((classItem) => (
				<ClassItem
					key={getListKey("class", classItem.id)}
					isEditable={isEditable}
					classItem={classItem}
				/>
			))}
		</div>
	);
}

export { ClassesList };
