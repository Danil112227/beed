import { useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import cn from "classnames";

import { queryClient } from "@query/index";

import { UserTypesEnum, useUsersQuery } from "@api/services/users";
import {
	addGradeStudent,
	AddGradeStudent,
	AddGradeStudentSuccessResponse,
	AddGradeStudentValidationError,
	useGradesQuery,
} from "@api/services/grade";

import {
	useSelect,
	MultiSelect,
	getSelectedValue,
	getSelectFormattedUserValues,
} from "@features/select";
import { USER_TYPES } from "@features/users-list";

import { addGradeStudentFormSchema } from "./schemas";

import { AddStudentDialogProps, AddGradeStudentsFields } from "./types";

import Cross from "@assets/vectors/cross.svg?react";

import "./AddStudentDialog.styles.scss";

function AddStudentDialog({ isVisible, onClose }: AddStudentDialogProps) {
	const { classId } = useParams();

	const {
		selectedValue: selectedStudents,
		onChangeSelectedValue: onChangeSelectedStudents,
	} = useSelect<number[]>({
		defaultSelectedValue: [],
	});

	const { mutate: addGradeStudentMutation } = useMutation<
		AddGradeStudentSuccessResponse,
		AddGradeStudentValidationError,
		AddGradeStudent
	>({
		mutationFn: addGradeStudent,
	});

	const {
		formState: { errors },
		handleSubmit,
		setError,
		setValue,
		reset,
	} = useForm<AddGradeStudentsFields>({
		resolver: zodResolver(addGradeStudentFormSchema),
	});

	useEffect(() => {
		if (!selectedStudents) {
			reset();
			return;
		}
		setValue("users", selectedStudents);
	}, [selectedStudents, setValue, reset]);

	const studentsResult = useUsersQuery({
		isEnabled: isVisible,
		queryType: "users-short",
		queryKey: ["users-short"],
		searchParams: {
			limit: 10000,
			filter: getSelectedValue(USER_TYPES[UserTypesEnum.STUDENT]),
		},
	});

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId && isVisible,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId: classId }],
		payload: { id: classId! },
	});

	useEffect(() => {
		if (gradeDetailsResult && isVisible) {
			onChangeSelectedStudents(gradeDetailsResult.users.map((user) => user.id));
		}
	}, [onChangeSelectedStudents, gradeDetailsResult, isVisible]);

	const submitFormHandler = (data: AddGradeStudentsFields) => {
		if (!classId) {
			return;
		}

		addGradeStudentMutation(
			{ gradeId: classId, students: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof AddGradeStudentValidationError["data"];
							setError(errorKey as keyof AddGradeStudentsFields, {
								message: errors[errorKey][0],
							});
						}
					}
				},
				onSuccess() {
					queryClient.invalidateQueries({ queryKey: ["grade-details"] });

					onClose();
				},
			},
		);
	};

	const selectFormattedStudentOptions = getSelectFormattedUserValues(
		studentsResult?.results,
	);

	return (
		<Dialog
			blockScroll
			modal
			visible={isVisible}
			draggable={false}
			resizable={false}
			onHide={onClose}
			content={({ hide }) => (
				<div className="popup">
					<div className="popup__head">
						<span className="popup__title main-title">Add student</span>
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
								<div className="main-form__fields">
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.users,
										})}
									>
										<label htmlFor="login" className="main-form__label">
											Students
										</label>
										<MultiSelect
											selectedValues={selectedStudents}
											initialData={selectFormattedStudentOptions}
											onChangeSelectedValues={onChangeSelectedStudents}
										/>
										{errors.users && (
											<p className="main-form__invalid-text">
												{errors.users?.message}
											</p>
										)}
									</div>
								</div>
							</div>
							<div className="main-form__buttons">
								<button onClick={hide} className="main-form__btn btn secondary">
									Cancel
								</button>
								<button type="submit" className="main-form__btn btn primary">
									Add
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		/>
	);
}

export { AddStudentDialog };
