import { format } from "date-fns";

import { Link } from "@components/common/Link";

import { HOMEWORK_STATUS } from "@features/user-details/data/constants";

import { HomeworkItemProps } from "./types";

function HomeworkItem({
	homework,
	onOpenViewHomeworkDialog,
}: HomeworkItemProps) {
	const { lesson, description, author, deadline, id, status, answer } =
		homework;
	const { title } = lesson;
	const { first_name, last_name } = author;
	const answerId = answer?.id || null;
	const searchParamsAnswerId = answer ? `&answer_id=${answerId}` : "";

	const isStatusVisible = typeof status === "number";

	const formattedStatus = isStatusVisible ? HOMEWORK_STATUS[status] : "";

	const formattedDeadlineDate = format(deadline, "dd.MM.yyyy");

	return (
		<Link
			nav={false}
			autoScrollable={true}
			to={`?homework=${id}${searchParamsAnswerId}`}
			onClick={onOpenViewHomeworkDialog}
			classes="project"
		>
			<div className="project__head">
				<div className="project__head-row">
					<div className="project__head-col">
						<span className="project__name">
							{title} <span className="project__type">lesson</span>{" "}
						</span>
					</div>
					{isStatusVisible && (
						<div className="project__head-col">
							<div className="project__status assigned">
								<span className="project__status-name">
									{formattedStatus[0] + formattedStatus.slice(1).toLowerCase()}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			<div
				className="project__list"
				dangerouslySetInnerHTML={{ __html: description }}
			></div>
			{ !!answer && (
				<div className="project__footer">
					<div className="project__owner">
						student{" "}
						<span className="project__owner-name">
							{answer?.author.first_name} {answer?.author.last_name}
						</span>
					</div>
				</div>
			)}

			<div className="project__footer">
				<div className="project__owner">
					teacher{" "}
					<span className="project__owner-name">
						{first_name} {last_name}
					</span>
				</div>
				<span className="project__date">deadline {formattedDeadlineDate}</span>
			</div>
		</Link>
	);
}

export { HomeworkItem };
