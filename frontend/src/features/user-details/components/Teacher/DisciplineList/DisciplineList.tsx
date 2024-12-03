import { useState } from "react";

import { Link } from "@components/common/Link";
import { DisciplineItem } from "../DisciplineItem";

import { getListKey } from "@utils/list-key";

import { DisciplineListProps } from "./types";

import Plus from "@assets/vectors/blue-plus.svg?react";

function DisciplineList({
	gradeId,
	disciplines,
	teacher,
	isCreatable,
	invalidateQueryKeyOnSuccess,
	isDeleteActive,
}: DisciplineListProps) {
	const [isExpanedList, setIsExpandedList] = useState(disciplines.length < 10);

	const showMoreHandler = () => {
		setIsExpandedList(true);
	};

	const slicedDisciplines = disciplines.slice(0, isExpanedList ? Infinity : 10);

	return (
		<section className="info-section">
			<div className="info-head">
				<span className="section-title">Disciplines</span>
				{isCreatable && (
					<Link
						classes="profile-tabs__add"
						autoScrollable={true}
						nav={false}
						to={`/disciplines/add?class=${gradeId}`}
					>
						<span className="profile-tabs__add-text">Add disciplines</span>
						<div className="profile-tabs__add-icon">
							<Plus />
						</div>
					</Link>
				)}
			</div>

			{!slicedDisciplines.length && <span>No disciplines added</span>}
			{!!slicedDisciplines.length && (
				<div className="discipline-row">
					{slicedDisciplines.map((discipline) => (
						<DisciplineItem
							key={getListKey("discipline", discipline.id)}
							isDeleteActive={isDeleteActive}
							discipline={discipline}
							teacher={teacher}
							invalidateQueryKeyOnSuccess={invalidateQueryKeyOnSuccess}
						/>
					))}
				</div>
			)}

			{!isExpanedList && (
				<div>
					<button type="button" onClick={showMoreHandler}>
						Show more
					</button>
				</div>
			)}
		</section>
	);
}

export { DisciplineList };
