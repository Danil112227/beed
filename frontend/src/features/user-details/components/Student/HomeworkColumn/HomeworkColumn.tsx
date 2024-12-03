import { format } from "date-fns";

import { HomeworkItem } from "../HomeworkItem";

import { getListKey } from "@utils/list-key";

import { HomeworkColumnProps } from "./types";

// import Comm from "@assets/vectors/comm.svg?react";

function HomeworkColumn({
	homeworks,
	columnDate,
	onOpenViewHomeworkDialog,
}: HomeworkColumnProps) {
	const date = new Date(columnDate);
	const dayOfWeek = format(date, "EEEE");
	const month = format(date, "MMM");
	const day = format(date, "dd");

	return (
		<div className="project-col">
			<div className="project-day">
				<span>
					{dayOfWeek}, {day} {month}
				</span>
			</div>

			{homeworks.map((homework) => (
				<HomeworkItem
					key={getListKey("homework", homework.id)}
					homework={homework}
					onOpenViewHomeworkDialog={onOpenViewHomeworkDialog}
				/>
			))}

			{/* <div className="project">
				<div className="project__head">
					<div className="project__head-row">
						<div className="project__head-col">
							<span className="project__name">
								English Verbs <span className="project__type">lesson</span>{" "}
							</span>
						</div>
						<div className="project__head-col">
							<div className="project__status assigned">
								<span className="project__status-name">Assigned</span>
							</div>
						</div>
					</div>
				</div>
				<div className="project__list">
					<div className="project__item">
						<div className="project__item-name">
							1.Go through exercise{" "}
							<span className="project__item-text">1A on page 10</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							2.Go through asdsad asdexercise{" "}
							<span className="project__item-text">from file</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							3.Go through exercise{" "}
							<span className="project__item-text">from attached</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							4.Go through exercise{" "}
							<span className="project__item-text">from attached</span>
						</div>
					</div>
				</div>

				<div className="project__footer">
					<div className="project__owner">
						teacher <span className="project__owner-name">Lisa Alex</span>
					</div>
					<span className="project__date">deadline 01.01.2024</span>
				</div>
			</div>

			<div className="project">
				<div className="project__head">
					<div className="project__head-row">
						<div className="project__head-col">
							<span className="project__name">
								English Verbs <span className="project__type">lesson</span>{" "}
							</span>
						</div>
						<div className="project__head-col">
							<div className="project__status completed">
								<span className="project__status-name">Completed</span>
								<div className="project__status-compl">
									<span className="project__status-compl-num">• 1</span>
									<div className="project__status-icon">
										<Comm />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="project__list">
					<div className="project__item">
						<div className="project__item-name">
							1.Go through exercise{" "}
							<span className="project__item-text">1A on page 10</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							2.Go through exercise{" "}
							<span className="project__item-text">from file</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							3.Go through exercise{" "}
							<span className="project__item-text">from attached</span>
						</div>
					</div>
				</div>

				<div className="project__footer">
					<div className="project__owner">
						teacher <span className="project__owner-name">Lisa Alex</span>
					</div>
					<span className="project__date">deadline 01.01.2024</span>
				</div>
			</div>

			<div className="project">
				<div className="project__head">
					<div className="project__head-row">
						<div className="project__head-col">
							<span className="project__name">
								English Verbs <span className="project__type">lesson</span>{" "}
							</span>
						</div>
						<div className="project__head-col">
							<div className="project__status review">
								<span className="project__status-name">Under review</span>
							</div>
						</div>
					</div>
				</div>
				<div className="project__list">
					<div className="project__item">
						<div className="project__item-name">
							1.Go through exercise{" "}
							<span className="project__item-text">1A on page 10</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							2.Go through asdsad asdexercise{" "}
							<span className="project__item-text">from file</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							3.Go through exercise{" "}
							<span className="project__item-text">from attached</span>
						</div>
					</div>
					<div className="project__item">
						<div className="project__item-name">
							4.Go through exercise{" "}
							<span className="project__item-text">from attached</span>
						</div>
					</div>
				</div>

				<div className="project__footer">
					<div className="project__owner">
						teacher <span className="project__owner-name">Lisa Alex</span>
					</div>
					<span className="project__date">deadline 01.01.2024</span>
				</div>
			</div> */}
		</div>
	);
}

export { HomeworkColumn };
