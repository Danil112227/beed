import { useState, ChangeEvent } from "react";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { useParams } from "react-router-dom";

import { queryClient } from "@query/index";

import {
	useLessonQuery,
	updateLessonStudentList,
	UpdateLessonStudentList,
	UpdateLessonStudentListSuccessResponse,
	UpdateLessonStudentListValidationError,
} from "@api/services/timetable";
import { useGradesQuery } from "@api/services/grade";
import { UserItem } from "@features/users-list";

import { getListKey } from "@utils/list-key";

import { editStudentListFormSchema } from "./schemas";

import { EditStudentListDialogProps, EditStudentListFields } from "./types";

import Cross from "@assets/vectors/cross.svg?react";
import Srch from "@assets/vectors/search.svg?react";

import "./EditStudentListDialog.styles.scss";

function EditStudentListDialog({
	isVisible,
	onClose,
}: EditStudentListDialogProps) {
	const { lessonId } = useParams();

	const [searchValue, setSearchValue] = useState("");
	const [submittedSearchValue, setSubmittedSearchValue] = useState("");

	const lessonDetailsResult = useLessonQuery({
		isEnabled: !!lessonId && isVisible,
		queryType: "lesson-details",
		queryKey: ["lesson-details", { lessonId }],
		payload: { id: lessonId! },
	});

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!lessonDetailsResult?.grade.id && isVisible,
		queryType: "grade-details",
		queryKey: [
			"grade-details",
			{ grade: lessonDetailsResult?.grade.id, isVisible },
		],
		payload: { id: lessonDetailsResult!.grade.id.toString() },
	});

	const { mutate: updateLessonStudentListMutation } = useMutation<
		UpdateLessonStudentListSuccessResponse,
		UpdateLessonStudentListValidationError,
		UpdateLessonStudentList
	>({
		mutationFn: updateLessonStudentList,
	});

	const { watch, handleSubmit, setValue } = useForm<EditStudentListFields>({
		resolver: zodResolver(editStudentListFormSchema),
		values: lessonDetailsResult && {
			students: lessonDetailsResult.students.map((student) => student.id),
		},
	});

	const studentList = watch("students");

	if (!lessonDetailsResult || !lessonId || !gradeDetailsResult) {
		return null;
	}
	const { students: lessonStudents, id } = lessonDetailsResult;
	const { users } = gradeDetailsResult;

	const filteredStudentsBySearch = users.filter(
		(user) =>
			submittedSearchValue.length === 0 ||
			`${user.first_name} ${user.last_name} ${user.Patronymic}`
				.toLowerCase()
				.includes(submittedSearchValue.toLowerCase()),
	);

	const submitFormHandler = (data: EditStudentListFields) => {
		updateLessonStudentListMutation(
			{
				lessonId: id.toString(),
				students: data,
			},
			{
				onSuccess() {
					queryClient.invalidateQueries({
						queryKey: ["lesson-details", { lessonId }],
					});

					onClose();
				},
			},
		);
	};

	const changeSearchValueHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const submitSearchValueHandler = () => {
		setSubmittedSearchValue(searchValue);
	};

	const toggleStudentHandler = (studentId: number) => {
		const isStudentAdded = studentList.includes(studentId);

		if (isStudentAdded) {
			const filteredStudentList = studentList.filter((id) => id !== studentId);

			setValue("students", filteredStudentList);
			return;
		}

		setValue("students", [...studentList, studentId]);
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
				<div className="popup popup--max popup--nohead">
					<div className="popup__head">
						<span className="popup__title main-title">Edit student list</span>
						<button onClick={hide} className="popup__close">
							<Cross />
						</button>
					</div>

					<div className="popup__body">
						<form
							className="main-form"
							onSubmit={handleSubmit(submitFormHandler)}
						>
							<div className="main-form__scroll">
								<div className="user-form__input-wrap">
									<input
										type="text"
										className="user-form__input"
										placeholder={"Search student"}
										value={searchValue}
										onChange={changeSearchValueHandler}
									/>
									<button
										type="button"
										className="user-form__search-btn"
										onClick={submitSearchValueHandler}
									>
										<Srch />
									</button>
								</div>

								<div className="main-form__fields">
									<p className="main-form__list-count">
										{lessonStudents.length} students attending the discipline
									</p>
									<div className="main-form__user-list">
										{filteredStudentsBySearch.map((student) => (
											<UserItem
												key={getListKey("student", student.id)}
												user={student}
												isDisableActions={true}
												isCheckboxVisible={true}
												isCheckboxChecked={studentList.includes(student.id)}
												onToggleCheckbox={toggleStudentHandler}
											/>
										))}
									</div>
								</div>
							</div>
							<div className="main-form__buttons">
								<button onClick={hide} className="main-form__btn btn secondary">
									Cancel
								</button>
								<button type="submit" className="main-form__btn btn primary">
									Save changes
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		/>
	);
}

export { EditStudentListDialog };
