import { LeadershipItem } from "../LeadershipItem";

import { getListKey } from "@utils/list-key";

import { LeadershipListProps } from "./types";

function LeadershipList({ grades }: LeadershipListProps) {
	return (
		<section className="info-section">
			<div className="info-head">
				<span className="section-title">Leadership</span>
			</div>
			{!grades.length && <span>No leaderships added</span>}
			{!!grades.length && (
				<div className="leadership-row">
					{grades.map((grade) => (
						<LeadershipItem key={getListKey("grade", grade.id)} grade={grade} />
					))}
				</div>
			)}
		</section>
	);
}

export { LeadershipList };
