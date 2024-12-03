import { Link } from "@components/common/Link";

import { LeadershipItemProps } from "./types";

function LeadershipItem({ grade }: LeadershipItemProps) {
	const { school, name, id } = grade;

	return (
		<div className="leadership-col">
			<div className="children">
				<div className="children__tags tag-row">
					<Link nav={false} autoScrollable={true} to={`/schools/${school.id}`}>
						<div className="tag-col">
							<div className="tag type-school">{school.name}</div>
						</div>
					</Link>
					<Link nav={false} autoScrollable={true} to={`/classes/${id}`}>
						<div className="tag-col">
							<div className="tag type-class">{name}</div>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}

export { LeadershipItem };
