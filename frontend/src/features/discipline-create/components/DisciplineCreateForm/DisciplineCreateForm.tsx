import { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import cn from "classnames";

import {
	createDiscipline,
	CreateDiscipline,
	CreateDisciplineValidationError,
	Discipline,
} from "@api/services/discipline";
import { useUsersQuery, UserTypesEnum } from "@api/services/users";
import { useGradesQuery } from "@api/services/grade";

import {
	getSelectedValue,
	getSelectFormattedUserValues,
	getSelectFormattedGradesValues,
} from "@features/select";
import { USER_TYPES } from "@features/users-list";

import { createDisciplineFormSchema } from "./schemas";

import { CreateDisciplineFields } from "./types";

function DisciplineCreateForm() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const classId = searchParams.get("class");

	const targetGradeResult = useGradesQuery({
		isEnabled: !!classId,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId: classId }],
		payload: { id: classId! },
	});

	const usersResult = useUsersQuery({
		isEnabled: true,
		isPaginationEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short"],
		searchParams: {
			limit: 10000,
			filter: getSelectedValue(
				UserTypesEnum.TEACHER,
				(value) => USER_TYPES[value!],
			),
		},
	});

	const gradesBySchoolResult = useGradesQuery({
		isEnabled: true,
		queryType: "grades",
		queryKey: ["all-grades"],
		searchParams: {
			limit: 10000,
		},
	});

	const { mutate: createDisciplineMutation } = useMutation<
		Discipline,
		CreateDisciplineValidationError,
		CreateDiscipline
	>({
		mutationFn: createDiscipline,
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		setError,
		setValue,
	} = useForm<CreateDisciplineFields>({
		resolver: zodResolver(createDisciplineFormSchema),
	});

	useEffect(() => {
		if (targetGradeResult) {
			const { id } = targetGradeResult;

			setValue("grades", id);
		}
	}, [targetGradeResult, setValue]);

	const selectFormattedUserOptions = getSelectFormattedUserValues(
		usersResult?.results,
	);
	const selectFormattedGradeOptions = getSelectFormattedGradesValues(
		gradesBySchoolResult?.results,
	);

	const submitFormHandler = (data: CreateDisciplineFields) => {
		createDisciplineMutation(
			{ discipline: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey =
								key as keyof CreateDisciplineValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					navigate(-1);
				},
			},
		);
	};

	const cancelCreateDisciplineHandler = () => {
		navigate(-1);
	};

	return (
		<form className="main-form" onSubmit={handleSubmit(submitFormHandler)}>
			<div className="main-form__fields">
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.name,
					})}
				>
					<label className="main-form__label main-form__required">
						Discipline name
					</label>
					<input
						type="text"
						{...register("name")}
						className="main-form__input input"
					/>
					{errors.name && (
						<p className="main-form__invalid-text">{errors.name?.message}</p>
					)}
				</div>
				<div className={cn("main-form__col")}>
					<label className="main-form__label">Link for lesson</label>
					<input
						type="text"
						{...register("default_link")}
						className="main-form__input input"
					/>
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.teacher,
					})}
				>
					<label className="main-form__label main-form__required">
						Teacher
					</label>
					<Controller
						name="teacher"
						control={control}
						render={({ field }) => (
							<SelectPicker
								className="select"
								{...field}
								cleanable={true}
								searchable={true}
								data={selectFormattedUserOptions}
							/>
						)}
					/>
					{errors.teacher && (
						<p className="main-form__invalid-text">{errors.teacher?.message}</p>
					)}
				</div>
				<div className={cn("main-form__col")}>
					<label htmlFor="child" className="main-form__label">
						Classes
					</label>
					<Controller
						name="grades"
						control={control}
						render={({ field }) => (
							<SelectPicker
								className="select"
								{...field}
								cleanable={true}
								searchable={true}
								data={selectFormattedGradeOptions}
							/>
						)}
					/>
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.description,
					})}
				>
					<label className="main-form__label main-form__required">
						Description
					</label>
					<textarea
						{...register("description")}
						placeholder="Indicate the school or specific classes where these lessons are conducted"
						className="main-form__input main-form__textarea main-form__textarea--long input"
					/>
					{errors.description && (
						<p className="main-form__invalid-text">
							{errors.description?.message}
						</p>
					)}
				</div>
			</div>
			<div className="main-form__buttons">
				<button
					className="main-form__btn btn secondary"
					onClick={cancelCreateDisciplineHandler}
				>
					Cancel
				</button>
				<button type="submit" className="main-form__btn btn primary">
					Add discipline
				</button>
			</div>
		</form>
	);
}

export { DisciplineCreateForm };
