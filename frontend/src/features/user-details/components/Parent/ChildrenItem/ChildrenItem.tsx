import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "@components/common/Link";

import { getListKey } from "@utils/list-key";
import { getFullUserName } from "@helpers/user-name";

import { ChildrenItemProps } from "./types";

function ChildrenItem({ child }: ChildrenItemProps) {
	const navigate = useNavigate();

	const { grades, first_name, last_name, Patronymic, id } = child;

	const schools = grades.map((grade) => grade.school);
	const fullName = getFullUserName({
		firstName: first_name,
		lastName: last_name,
		patronymic: Patronymic,
	});

	const navigateToUserHandler = (
		event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
	) => {
		event.preventDefault();
		event.stopPropagation();

		navigate(`/users/${id}`);
	};

	const tagClickHandler = (
		event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
	) => {
		event.stopPropagation();
	};

	return (
		<div className="children-col">
			<div
				className="children"
				style={{ cursor: "pointer" }}
				onClick={navigateToUserHandler}
			>
				<span className="children__name">{fullName}</span>
				<div className="children__tags tag-row">
					{schools.map((school) => (
						<div key={getListKey("school", school.id)} className="tag-col">
							<Link
								nav={false}
								autoScrollable={true}
								to={`/schools/${school.id}`}
								onClick={tagClickHandler}
							>
								<div className="tag type-school">{school.name}</div>
							</Link>
						</div>
					))}
					{grades.map((grade) => (
						<div key={getListKey("grade", grade.id)} className="tag-col">
							<Link
								nav={false}
								autoScrollable={true}
								to={`/classes/${grade.id}`}
								onClick={tagClickHandler}
							>
								<div className="tag type-class">{grade.name}</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export { ChildrenItem };
