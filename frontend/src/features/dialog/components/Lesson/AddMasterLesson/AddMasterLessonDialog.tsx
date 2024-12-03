import { useEffect, useMemo } from "react";

import cn from "classnames";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "primereact/dialog";
import { SelectPicker } from "rsuite";
import { useParams, useSearchParams } from "react-router-dom";
import { addMinutes, format } from "date-fns";

import { queryClient } from "@query/index";

import {
	createMasterLesson,
	CreateMasterLesson,
	CreateMasterLessonSuccessResponse,
	CreateMasterLessonValidationError,
} from "@api/services/timetable";
import { useGradesQuery } from "@api/services/grade";

import {
	getSelectFormattedDisciplineValues,
	getSelectFormattedLessonDurationTimeValues,
	getSelectFormattedLessonStartTimeValues,
	getSelectFormattedUserValues,
	MultiSelect,
	useSelect,
} from "@features/select";

import { addMasterLessonFormSchema } from "./schemas";

import { AddMasterLessonDialogProps, AddMasterLessonFields } from "./types";

import Cross from "@assets/vectors/cross.svg?react";

import "./AddMasterLessonDialog.styles.scss";

function AddMasterLessonDialog({
	isVisible,
	onClose,
}: AddMasterLessonDialogProps) {
	const { classId } = useParams();
	const [searchParams] = useSearchParams();

	const dayOfWeek = searchParams.get("dayOfWeek");
	const period = searchParams.get("period");
	const initialStartTime = searchParams.get("startTime");

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId && isVisible,
		queryType: "grade-details",
		queryKey: ["grade-details", { grade: classId, isVisible }],
		payload: { id: classId! },
	});

	const { mutate: createMasterLessonMutation } = useMutation<
		CreateMasterLessonSuccessResponse,
		CreateMasterLessonValidationError,
		CreateMasterLesson
	>({
		mutationFn: createMasterLesson,
	});

	const {
		selectedValue: selectedStudents,
		onChangeSelectedValue: onChangeSelectedStudents,
	} = useSelect<number[]>({
		defaultSelectedValue: [],
	});

	const {
		formState: { errors },
		watch,
		handleSubmit,
		register,
		setValue,
		setError,
		reset,
		control,
	} = useForm<AddMasterLessonFields>({
		resolver: zodResolver(addMasterLessonFormSchema),
	});

	const discipline = watch("discipline");

	useEffect(() => {
		if (isVisible) {
			reset();
			onChangeSelectedStudents([]);
		}
	}, [isVisible, reset, onChangeSelectedStudents]);

	useEffect(() => {
		if (gradeDetailsResult && isVisible) {
			onChangeSelectedStudents(gradeDetailsResult.users.map((user) => user.id));
		}
	}, [onChangeSelectedStudents, gradeDetailsResult, isVisible]);

	useEffect(() => {
		if (period && isVisible) {
			setValue("period", +period);
		}
	}, [period, isVisible, setValue]);

	useEffect(() => {
		if (gradeDetailsResult && isVisible) {
			setValue("grade", gradeDetailsResult.id);
		}
	}, [gradeDetailsResult, isVisible, setValue]);

	useEffect(() => {
		if (dayOfWeek && isVisible) {
			setValue("day_of_week", dayOfWeek);
		}
	}, [dayOfWeek, isVisible, setValue]);

	useEffect(() => {
		if (isVisible) {
			setValue("students", selectedStudents);
		}
	}, [selectedStudents, isVisible, setValue]);

	useEffect(() => {
		if (isVisible && initialStartTime) {
			setValue("start_time", initialStartTime);
		}
	}, [isVisible, initialStartTime, setValue]);

	useEffect(() => {
		const foundDiscipline = gradeDetailsResult?.disciplines.find(
			(d) => d.id === discipline,
		);

		if (foundDiscipline) {
			setValue("title", foundDiscipline.name);
		}
	}, [setValue, discipline, gradeDetailsResult?.disciplines]);

	useEffect(() => {
		const foundDiscipline = gradeDetailsResult?.disciplines.find(
			(d) => d.id === discipline,
		);

		if (foundDiscipline) {
			setValue("lesson_link", foundDiscipline.default_link);
		}
	}, [setValue, discipline, gradeDetailsResult?.disciplines]);

	const selectFormattedDisciplineOptions = getSelectFormattedDisciplineValues(
		gradeDetailsResult?.disciplines,
	);

	const selectFormattedLessonDurationTimeOptions = useMemo(
		() => getSelectFormattedLessonDurationTimeValues(),
		[],
	);

	const selectFormattedLessonStartTimeOptions =
		getSelectFormattedLessonStartTimeValues();

	const selectFormattedStudentOptions = getSelectFormattedUserValues(
		gradeDetailsResult?.users.map((user) => ({
			...user,
			can_delete: false,
			can_edit: false,
		})),
	);

	useEffect(() => {
		const foundDefaultDurationTime =
			selectFormattedLessonDurationTimeOptions.find(
				(duration) => duration.value === 30,
			);

		if (isVisible && foundDefaultDurationTime) {
			setValue("duration", foundDefaultDurationTime.value);
		}
	}, [setValue, selectFormattedLessonDurationTimeOptions, isVisible]);

	const durationTime = watch("duration") || 0;
	const [startHoursTime, startMinutesTime] = watch("start_time")?.split(
		":",
	) || ["00", "00"];

	const date = new Date(2024, 1, 1, +startHoursTime, +startMinutesTime);

	const endTime = format(addMinutes(date, durationTime), "hh:mm aaaa");

	const submitFormHandler = (data: AddMasterLessonFields) => {
		createMasterLessonMutation(
			{ lesson: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof CreateMasterLessonValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					onClose();
					queryClient.invalidateQueries({ queryKey: ["lessons"] });
					queryClient.invalidateQueries({ queryKey: ["master-lessons"] });
				},
			},
		);
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
				<div className="popup popup--leson popup--nohead">
					<div className="popup__head">
						<span className="popup__title main-title">Create new lesson</span>
						<button onClick={hide} className="popup__close">
							<Cross />
						</button>
					</div>

					<div className="popup__body">
						<form
							onSubmit={handleSubmit(submitFormHandler)}
							className="main-form"
						>
							<div className="main-form__scroll">
								<div className="main-form__fields">
									<span className="popup__leson-day">{dayOfWeek}</span>
								</div>
								<div className="main-form__fields">
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.discipline,
										})}
									>
										<label
											htmlFor="discipline"
											className="main-form__label main-form__required"
										>
											Discipline
										</label>
										<Controller
											name="discipline"
											control={control}
											render={({ field }) => (
												<SelectPicker
													className="select"
													{...field}
													cleanable={true}
													searchable={true}
													data={selectFormattedDisciplineOptions}
												/>
											)}
										/>
										{errors.discipline && (
											<p className="main-form__invalid-text">
												{errors.discipline?.message}
											</p>
										)}
									</div>
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.title,
										})}
									>
										<label
											htmlFor="name_of_class"
											className="main-form__label main-form__required"
										>
											Lesson name
										</label>
										<input
											type="text"
											{...register("title")}
											className="main-form__input input"
										/>
										{errors.title && (
											<p className="main-form__invalid-text">
												{errors.title?.message}
											</p>
										)}
									</div>

									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.duration,
										})}
									>
										<label
											htmlFor="name_of_class"
											className="main-form__label main-form__required"
										>
											Duration of the lesson
										</label>
										<Controller
											name="duration"
											control={control}
											render={({ field }) => (
												<SelectPicker
													className="select"
													{...field}
													cleanable={true}
													searchable={true}
													data={selectFormattedLessonDurationTimeOptions}
												/>
											)}
										/>
										{errors.duration && (
											<p className="main-form__invalid-text">
												{errors.duration?.message}
											</p>
										)}
									</div>

									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.start_time,
										})}
									>
										<label
											htmlFor="name_of_class"
											className="main-form__label main-form__required"
										>
											Start time
										</label>
										<Controller
											name="start_time"
											control={control}
											render={({ field }) => (
												<SelectPicker
													className="select"
													{...field}
													cleanable={true}
													searchable={true}
													data={selectFormattedLessonStartTimeOptions}
												/>
											)}
										/>
										{errors.start_time && (
											<p className="main-form__invalid-text">
												{errors.start_time?.message}
											</p>
										)}
										<p className="popup__leson-end">End time {endTime}</p>
									</div>

									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.lesson_link,
										})}
									>
										<label
											htmlFor="name_of_class"
											className="main-form__label main-form__required"
										>
											Lesson link
										</label>
										<input
											type="text"
											{...register("lesson_link")}
											className="main-form__input input"
										/>
										{errors.lesson_link && (
											<p className="main-form__invalid-text">
												{errors.lesson_link?.message}
											</p>
										)}
									</div>
									<div
										className={cn("main-form__col", {
											"main-form__invalid": errors.students,
										})}
									>
										<label htmlFor="tutors" className="main-form__label">
											Students
										</label>
										<MultiSelect
											selectedValues={selectedStudents}
											initialData={selectFormattedStudentOptions}
											onChangeSelectedValues={onChangeSelectedStudents}
										/>
										{errors.students && (
											<p className="main-form__invalid-text">
												{errors.students?.message}
											</p>
										)}
									</div>
								</div>
							</div>
							<div className="main-form__buttons">
								<button
									type="button"
									className="main-form__btn btn secondary"
									onClick={onClose}
								>
									Cancel
								</button>
								<button type="submit" className="main-form__btn btn primary">
									Create new lesson
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		/>
	);
}

export { AddMasterLessonDialog };
