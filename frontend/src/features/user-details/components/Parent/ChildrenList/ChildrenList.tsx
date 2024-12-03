import { ChildrenItem } from "../ChildrenItem";

import { getListKey } from "@utils/list-key";

import { ChildrenListProps } from "./types";

function ChildrenList({ childs }: ChildrenListProps) {
	return (
		<section className="info-section">
			<div className="info-head">
				<span className="section-title">Children</span>
			</div>
			{!childs.length && <span>No children added</span>}
			{!!childs.length && (
				<div className="children-row">
					{childs.map((child) => (
						<ChildrenItem key={getListKey("child", child.id)} child={child} />
					))}
				</div>
			)}
		</section>
	);
}

export { ChildrenList };
