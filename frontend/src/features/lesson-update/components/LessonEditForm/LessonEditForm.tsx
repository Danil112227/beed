import { useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { editorConfiguration } from "@lib/ckeditor";
import cn from "classnames";

import { Link } from "@components/common/Link";

import {
	useLessonQuery,
	updateLesson,
	UpdateLesson,
	UpdateLessonSuccessResponse,
	UpdateLessonValidationError,
} from "@api/services/timetable";
import { useDisciplinesQuery } from "@api/services/discipline";
import { useUsersQuery, UserTypesEnum } from "@api/services/users";
import { useGradesQuery } from "@api/services/grade";

import { USER_TYPES } from "@features/users-list";
import {
	getSelectFormattedDisciplineValues,
	getSelectFormattedUserValues,
	getSelectedValue,
	MultiSelect,
	useSelect,
} from "@features/select";

import { editLessonFormSchema } from "./schemas";

import { EditLessonFields } from "./types";

const LessonEditForm = () => {
	const { lessonId, classId } = useParams();
	const navigate = useNavigate();

	const disciplinesResult = useDisciplinesQuery({
		isEnabled: true,
		queryType: "disciplines",
		queryKey: ["disciplines"],
	});

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!classId,
		queryType: "grade-details",
		queryKey: ["grade-details", { grade: classId }],
		payload: { id: classId! },
	});

	const teachersResult = useUsersQuery({
		isEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short", { type: UserTypesEnum.TEACHER }],
		searchParams: {
			limit: 10000,
			filter: getSelectedValue(USER_TYPES[UserTypesEnum.TEACHER]),
		},
	});

	const studentsResult = useUsersQuery({
		isEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short", { type: UserTypesEnum.STUDENT }],
		searchParams: {
			limit: 10000,
			filter: getSelectedValue(USER_TYPES[UserTypesEnum.STUDENT]),
		},
	});

	const lessonDetailsResult = useLessonQuery({
		isEnabled: !!lessonId,
		queryType: "lesson-details",
		queryKey: ["lesson-details"],
		payload: {
			id: lessonId!,
		},
	});

	const {
		selectedValue: selectedStudents,
		onChangeSelectedValue: onChangeSelectedStudents,
	} = useSelect<number[]>({
		defaultSelectedValue: [],
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		setError,
		register,
	} = useForm<EditLessonFields>({
		resolver: zodResolver(editLessonFormSchema),
		values: lessonDetailsResult && {
			discipline: lessonDetailsResult.discipline.id,
			title: lessonDetailsResult.title,
			temp_teacher: null,
			lesson_link: lessonDetailsResult.lesson_link,
			students: lessonDetailsResult.students.map((student) => student.id),
			description: lessonDetailsResult.description,
			grade: lessonDetailsResult.grade.id,
		},
	});

	useEffect(() => {
		setValue("students", selectedStudents);
	}, [selectedStudents, setValue]);

	useEffect(() => {
		if (lessonDetailsResult) {
			onChangeSelectedStudents(
				lessonDetailsResult.students.map((student) => student.id),
			);
		}
	}, [onChangeSelectedStudents, lessonDetailsResult]);

	const { mutate: updateLessonMutation } = useMutation<
		UpdateLessonSuccessResponse,
		UpdateLessonValidationError,
		UpdateLesson
	>({
		mutationFn: updateLesson,
	});

	const selectFormattedStudentOptions = getSelectFormattedUserValues(
		studentsResult?.results,
	);

	const selectFormattedTeacherOptions = getSelectFormattedUserValues(
		teachersResult?.results,
	);

	const selectFormattedDisciplineOptions = getSelectFormattedDisciplineValues(
		disciplinesResult?.results,
	);

	const submitFormHandler = (data: EditLessonFields) => {
		if (!gradeDetailsResult || !lessonDetailsResult) {
			return;
		}

		const { id: gradeId } = gradeDetailsResult;
		const { id: lessonId } = lessonDetailsResult;

		updateLessonMutation(
			{ lessonId: lessonId.toString(), lesson: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof UpdateLessonValidationError["data"];
							setError(errorKey as keyof EditLessonFields, {
								message: errors[errorKey][0],
							});
						}
					}
				},
				onSuccess(result) {
					const { id } = result;

					navigate(`/classes/${gradeId}/lessons/${id}`);
				},
			},
		);
	};

	if (!gradeDetailsResult || !lessonDetailsResult) {
		return null;
	}

	const { temp_teacher, lesson_template } = lessonDetailsResult;

	const lessonTeacher = temp_teacher ?? lesson_template?.discipline.teacher;

	return (
		<form onSubmit={handleSubmit(submitFormHandler)} className="main-form">
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
						<p className="main-form__invalid-text">{errors.title?.message}</p>
					)}
				</div>

				<div className={cn("main-form__col")}>
					<label htmlFor="name_of_class" className="main-form__label">
						Description
					</label>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<CKEditor
								editor={ClassicEditor}
								config={editorConfiguration}
								{...field}
								data={field.value}
								onChange={(_, editor) => {
									field.onChange(editor.getData());
								}}
							/>
						)}
					/>
					{errors.description && (
						<p className="main-form__invalid-text">
							{errors.description?.message}
						</p>
					)}
				</div>

				<div className={cn("main-form__col")}>
					<div style={{ display: "flex" }}>
						<span>Current teacher</span>
						<span>
							{lessonTeacher?.first_name} {lessonTeacher?.last_name}
						</span>
					</div>
				</div>
				<div className={cn("main-form__col")}>
					<label htmlFor="temp_teacher" className="main-form__label">
						New teacher
					</label>
					<Controller
						name="temp_teacher"
						control={control}
						render={({ field }) => (
							<SelectPicker
								className="select"
								{...field}
								cleanable={true}
								searchable={true}
								data={selectFormattedTeacherOptions}
							/>
						)}
					/>
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
			<div className="main-form__buttons">
				<Link
					to=".."
					autoScrollable={true}
					nav={false}
					classes="main-form__btn btn secondary"
				>
					Cancel
				</Link>
				<button type="submit" className="main-form__btn btn primary">
					Save
				</button>
			</div>
		</form>
	);
};

export { LessonEditForm };
