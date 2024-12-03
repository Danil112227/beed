import { useMemo, useState, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { useSearchParams, useParams } from "react-router-dom";
import { format } from "date-fns";

import { useHomeworksQuery, HomeworkStatusEnum } from "@api/services/homework";
import { UserTypesEnum } from "@api/services/users";

import {
	DocumentItem,
	HOMEWORK_TYPES,
	HOMEWORK_STATUS,
} from "@features/user-details";
import { useAuth } from "@features/auth";

import { StudentAnswerCreateForm } from "../StudentAnswerCreateForm";
import { StudentAnswerView } from "../StudentAnswerView";
import { StudentAnswerEditForm } from "../StudentAnswerEditForm";
import { TeacherAnswerCreateForm } from "../TeacherAnswerCreateForm";
import { TeacherAnswerView } from "../TeacherAnswerView";
import { TeacherAnswerFullView } from "../TeacherAnswerFullView";
import { TeacherAnswerEditForm } from "../TeacherAnswerEditForm";

import { USER_TYPES } from "@features/users-list";

import { getListKey } from "@utils/list-key";

import { ViewHomeworklDialogProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Del from "@assets/vectors/del.svg?react";
import Edit from "@assets/vectors/edit.svg?react";
import Back from "@assets/vectors/back-48.svg?react";

import "./ViewHomeworkDialog.styles.scss";

function ViewHomeworkDialog({
	isAttachUser,
	isVisible,
	isControlActive,
	isOverallInterface,
	onDelete,
	onEdit,
	onClose,
}: ViewHomeworklDialogProps) {
	const [isStudentAnswerEditFormOpen, setIsStudentAnswerEditFormOpen] =
		useState(false);
	const [isTeacherAnswerEditFormOpen, setIsTeacherAnswerEditFormOpen] =
		useState(false);
	const [isHomeworkDetailsOpen, setIsHomeworkDetailsOpen] = useState(false);

	const [searchParams] = useSearchParams();
	const { id } = useParams();

	const homeworkId = searchParams.get("homework");
	const answerId = searchParams.get("answer_id");

	const { user } = useAuth({});

	const homeworkDetailsResult = useHomeworksQuery({
		isEnabled: !!homeworkId && isVisible,
		queryType: "homework-details",
		queryKey: [
			"homework-details",
			{ homeworkId, userId: id || user?.id, answerId },
		],
		payload: { id: homeworkId! },
		searchParams: {
			user: isAttachUser ? id || user?.id : null,
			answer: answerId,
		},
	});

	// const homeworkStudentAnswers = useHomeworksQuery({
	// 	isEnabled: !!homeworkId,
	// 	queryType: "homework-student-answers",
	// 	queryKey: ["homework-student-answers", { homeworkId }],
	// });

	// const homeworkTeacherAnswers = useHomeworksQuery({
	// 	isEnabled: !!homeworkId,
	// 	queryType: "homework-teacher-answers",
	// 	queryKey: ["homework-teacher-answers", { homeworkId }],
	// });

	// const studentAnswer = useMemo(() => {
	// 	if (!homeworkStudentAnswers || !homeworkId || (!user && !id)) {
	// 		return;
	// 	}

	// 	const { results } = homeworkStudentAnswers;

	// 	return results.find((answer) => {
	// 		const isTargetHomework = answer.homework.id.toString() === homeworkId;

	// 		if (user?.type === UserTypesEnum.STUDENT) {
	// 			return isTargetHomework && answer.author.id === user.id;
	// 		}
	// 		return isTargetHomework && answer.author.id.toString() === id;
	// 	});
	// }, [homeworkId, homeworkStudentAnswers, user, id]);

	// const teacherAnswer = useMemo(() => {
	// 	if (!homeworkTeacherAnswers || !homeworkId || !studentAnswer) {
	// 		return;
	// 	}

	// 	const { results } = homeworkTeacherAnswers;

	// 	return results.find((answer) => answer.answer.id === studentAnswer.id);
	// }, [homeworkId, homeworkTeacherAnswers, studentAnswer]);

	const formattedHomeworkStatus = useMemo(() => {
		if (!homeworkDetailsResult?.answer) {
			return HOMEWORK_STATUS[HomeworkStatusEnum.ASSIGNED];
		}

		return HOMEWORK_STATUS[homeworkDetailsResult?.answer.status];
	}, [homeworkDetailsResult?.answer]);

	useEffect(() => {
		if (isVisible) {
			setIsStudentAnswerEditFormOpen(false);
			setIsTeacherAnswerEditFormOpen(false);
			setIsHomeworkDetailsOpen(false);
		}
	}, [isVisible]);

	if (!homeworkDetailsResult || !homeworkId) {
		return null;
	}
	const {
		lesson,
		description,
		documents,
		deadline,
		author,
		type,
		id: homeworkDetailsId,
		answer: studentAnswer,
		teacher_answer: teacherAnswer,
		can_delete,
		can_edit,
	} = homeworkDetailsResult;

	const studentAnswerDocuments = studentAnswer?.documents || [];
	const studentAnswerDescription = studentAnswer?.description || "";
	const studentAnswerCanEdit = studentAnswer?.can_edit || false;

	const homeworkStatus = studentAnswer?.status || HomeworkStatusEnum.ASSIGNED;

	const isUserStudent = user?.type === UserTypesEnum.STUDENT;
	const isUserTutor = user?.type === UserTypesEnum.TUTOR;
	const isUserTeacher = user?.type === UserTypesEnum.TEACHER;

	const isStudentAnswerExist = !!studentAnswer;
	const isStudentAnswerCreatable =
		homeworkStatus === HomeworkStatusEnum.ASSIGNED ||
		homeworkStatus === HomeworkStatusEnum.UNDER_REVIEW;
	const isStudentAnswerEditable =
		(isUserStudent || isUserTutor) &&
		isStudentAnswerExist &&
		(homeworkStatus === HomeworkStatusEnum.ASSIGNED ||
			homeworkStatus === HomeworkStatusEnum.UNDER_REVIEW);

	const isTeacherAnswerExist = !!teacherAnswer;
	const isTeacherAnswerCreatable =
		homeworkStatus === HomeworkStatusEnum.UNDER_REVIEW ||
		homeworkStatus === HomeworkStatusEnum.ASSIGNED;
	const teacherAnswerCanEdit =
		teacherAnswer?.can_edit || user?.type === UserTypesEnum.TEACHER;

	const { first_name, last_name, type: userType } = author;

	const formattedDeadlineDate = format(deadline, "dd.MM.yyyy");

	const formattedUserType = USER_TYPES[userType];
	const formattedHomeworkType = isUserTeacher
		? "Teacher review"
		: HOMEWORK_TYPES[type];

	const openStudentAnswerEditFormHandler = () => {
		setIsStudentAnswerEditFormOpen(true);
	};

	const closeStudentAnswerEditFormHandler = () => {
		setIsStudentAnswerEditFormOpen(false);
	};

	const openTeacherAnswerEditFormHandler = () => {
		setIsTeacherAnswerEditFormOpen(true);
	};

	const closeTeacherAnswerEditFormHandler = () => {
		setIsTeacherAnswerEditFormOpen(false);
	};

	const openHomeworkDetailsHandler = () => {
		setIsHomeworkDetailsOpen(true);
	};

	const closeHomeworkDetailsHandler = () => {
		setIsHomeworkDetailsOpen(false);
	};

	return (
		<Dialog
			blockScroll
			modal
			visible={isVisible}
			draggable={false}
			resizable={false}
			onHide={onClose}
			content={({ hide }) => (
				<div className="popup popup--max">
					<div className="popup__head">
						<div className="popup__head-row">
							{isHomeworkDetailsOpen && (
								<button
									className="popup__head-back"
									type="button"
									onClick={closeHomeworkDetailsHandler}
								>
									<Back />
								</button>
							)}
							<span className="popup__title main-title">
								{formattedHomeworkType}
								{isHomeworkDetailsOpen && " details"}
							</span>
						</div>
						<button
							onClick={(event) => {
								closeHomeworkDetailsHandler();
								hide(event);
							}}
							className="popup__close"
						>
							<Cross />
						</button>
					</div>

					<div className="popup__scroll">
						<div className="popup__col">
							<div className="popup__leson-head">
								<span className="popup__leson-name">
									{lesson.title}{" "}
									<span className="popup__leson-name-sub"> lesson </span>
								</span>
								<div className="popup__deadline-row">
									<span className="popup__deadline-title">
										Deadline {formattedDeadlineDate}
									</span>
									<span className="project__status assigned">
										{formattedHomeworkStatus}
									</span>
								</div>
							</div>
						</div>

						{(!isTeacherAnswerExist ||
							(isTeacherAnswerExist && isUserTeacher)) && (
							<div className="popup__body">
								{isUserTeacher &&
									!isTeacherAnswerExist &&
									isTeacherAnswerCreatable &&
									!isOverallInterface && (
										<TeacherAnswerCreateForm
											isVisible={isVisible}
											answerId={studentAnswer?.id}
										/>
									)}

								{isUserTeacher &&
									isTeacherAnswerExist &&
									isTeacherAnswerEditFormOpen &&
									teacherAnswerCanEdit &&
									!isOverallInterface && (
										<TeacherAnswerEditForm
											isVisible={isVisible}
											teacherAnswer={teacherAnswer}
											onClose={closeTeacherAnswerEditFormHandler}
										/>
									)}

								{isUserTeacher &&
									isTeacherAnswerExist &&
									!isTeacherAnswerEditFormOpen && (
										<TeacherAnswerView
											description={teacherAnswer.description}
											documents={teacherAnswer.documents}
										/>
									)}

								<span className="popup__view-title">Homework</span>
								<div className="popup__col">
									<div className="popup__desc-wrap">
										<p
											className="popup__material-desc"
											dangerouslySetInnerHTML={{ __html: description }}
										></p>
										{/* <button className="show-more">
										<span className="show-more__text">Show more</span>
										<div className="show-more__icon">
											<Down />
										</div>
									</button> */}
									</div>
								</div>

								<div className="popup__col">
									{!!documents.length && (
										<>
											<span className="popup__view-title">Materials</span>
											<div className="popup__material-row">
												{documents.map((document) => (
													<div
														className="popup__material-col"
														key={getListKey("document-view", document.id)}
													>
														<DocumentItem document={document} />
													</div>
												))}
											</div>
										</>
									)}

									<span className="popup__material-added-by">
										Added {formattedDeadlineDate} by {formattedUserType}{" "}
										<span className="popup__material-added-name">
											{last_name} {first_name}
										</span>
									</span>
								</div>

								{(isUserStudent || isUserTutor) &&
									!isStudentAnswerExist &&
									isStudentAnswerCreatable &&
									!isOverallInterface && (
										<StudentAnswerCreateForm
											isVisible={isVisible}
											homeworkId={homeworkDetailsId}
										/>
									)}
								{isStudentAnswerExist && !isStudentAnswerEditFormOpen && (
									<StudentAnswerView
										description={studentAnswerDescription}
										documents={studentAnswerDocuments}
									/>
								)}
								{isStudentAnswerEditable &&
									isStudentAnswerEditFormOpen &&
									studentAnswerCanEdit &&
									studentAnswer &&
									!isOverallInterface && (
										<StudentAnswerEditForm
											homeworkId={homeworkDetailsId}
											isVisible={isVisible}
											studentAnswer={studentAnswer}
											onClose={closeStudentAnswerEditFormHandler}
										/>
									)}

								{/* <div className="popup__col">
								<span className="popup__view-title">Homework result</span>
								{!!documents.length && (
								<div className="popup__material-row">
									{documents.map((document) => (
										<div
											className="popup__material-col"
											key={getListKey("document-view", document.id)}
										>
											<DocumentItem document={document} />
										</div>
									))}
								</div>
							)}
							</div>

							<div className="popup__col">
								<span className="popup__answer">Answer</span>
								<p className="popup__answer-desc">
									The content of the homework itself is aimed at developing the
									ability to reason, analyze, and draw an independent
									conclusion.
								</p>
							</div> */}
							</div>
						)}
						{isTeacherAnswerExist && !isUserTeacher && (
							<div className="popup__body">
								{isStudentAnswerEditable && (
									<>
										<TeacherAnswerView
											description={teacherAnswer.description}
											documents={teacherAnswer.documents}
										/>
										<span className="popup__view-title">Homework</span>
										<div className="popup__col">
											<div className="popup__desc-wrap">
												<p
													className="popup__material-desc"
													dangerouslySetInnerHTML={{ __html: description }}
												></p>
												{/* <button className="show-more">
										<span className="show-more__text">Show more</span>
										<div className="show-more__icon">
											<Down />
										</div>
									</button> */}
											</div>
										</div>

										<div className="popup__col">
											{!!documents.length && (
												<>
													<span className="popup__view-title">Materials</span>
													<div className="popup__material-row">
														{documents.map((document) => (
															<div
																className="popup__material-col"
																key={getListKey("document-view", document.id)}
															>
																<DocumentItem document={document} />
															</div>
														))}
													</div>
												</>
											)}

											<span className="popup__material-added-by">
												Added {formattedDeadlineDate} by {formattedUserType}{" "}
												<span className="popup__material-added-name">
													{last_name} {first_name}
												</span>
											</span>
										</div>
										{isStudentAnswerExist && !isStudentAnswerEditFormOpen && (
											<StudentAnswerView
												description={studentAnswerDescription}
												documents={studentAnswerDocuments}
											/>
										)}
										{isStudentAnswerEditFormOpen &&
											studentAnswer &&
											studentAnswerCanEdit &&
											!isOverallInterface && (
												<StudentAnswerEditForm
													homeworkId={homeworkDetailsId}
													isVisible={isVisible}
													studentAnswer={studentAnswer}
													onClose={closeStudentAnswerEditFormHandler}
												/>
											)}
									</>
								)}
								{!isHomeworkDetailsOpen && !isStudentAnswerEditable && (
									<TeacherAnswerView
										description={teacherAnswer.description}
										documents={teacherAnswer.documents}
									/>
								)}
								{isHomeworkDetailsOpen && studentAnswer && (
									<TeacherAnswerFullView studentAnswer={studentAnswer} />
								)}
							</div>
						)}
					</div>

					{isStudentAnswerEditable && !isStudentAnswerEditFormOpen && (
						<div className="popup__footer popup__footer--short">
							<div className="popup__footer-row">
								<div className="popup__footer-col">
									<button
										className="popup-btn secondary"
										onClick={openStudentAnswerEditFormHandler}
									>
										Edit answer
										<Edit />
									</button>
								</div>
							</div>
						</div>
					)}

					{isTeacherAnswerExist &&
						!isUserTeacher &&
						!isHomeworkDetailsOpen &&
						!isStudentAnswerEditable && (
							<div className="popup__footer popup__footer--short">
								<div className="popup__footer-row">
									<div className="popup__footer-col">
										<button
											className="popup-btn secondary"
											onClick={openHomeworkDetailsHandler}
										>
											Homework details
										</button>
									</div>
								</div>
							</div>
						)}

					{isTeacherAnswerExist &&
						isUserTeacher &&
						!isTeacherAnswerEditFormOpen && (
							<div className="popup__footer popup__footer--short">
								<div className="popup__footer-row">
									<div className="popup__footer-col">
										<button
											className="popup-btn secondary"
											onClick={openTeacherAnswerEditFormHandler}
										>
											Edit review
										</button>
									</div>
								</div>
							</div>
						)}

					{isControlActive && (
						<div className="popup__footer popup__footer--short">
							<div className="popup__footer-row">
								{can_delete && (
									<div className="popup__footer-col">
										<button className="popup-btn tertiary" onClick={onDelete}>
											Delete
											<Del />
										</button>
									</div>
								)}
								{can_edit && (
									<div className="popup__footer-col">
										<button className="popup-btn secondary" onClick={onEdit}>
											Edit
											<Edit />
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		/>
	);
}

export { ViewHomeworkDialog };
