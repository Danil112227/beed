import { getListKey } from "@utils/list-key";

import { SchoolItem } from "../SchoolItem";

import { SchoolsListProps } from "./types";

function SchoolList({ schools }: SchoolsListProps) {
	return (
		<div className="user-list">
			{schools.map((school) => (
				<SchoolItem key={getListKey("school", school.id)} school={school} />
			))}
		</div>
	);
}

export { SchoolList };
