import { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import cn from "classnames";

import { Link } from "@components/common/Link";

import { createClassFormSchema } from "./schemas";
import { useUsersQuery, UserTypesEnum } from "@api/services/users";
import { useSchoolsQuery } from "@api/services/schools";
import {
	createGrade,
	CreateGrade,
	CreateGradeSuccessResponse,
	CreateGradeValidationError,
} from "@api/services/grade";

import { USER_TYPES } from "@features/users-list";
import {
	getSelectFormattedSchoolsValues,
	getSelectFormattedUserValues,
	getSelectedValue,
	MultiSelect,
	useSelect,
} from "@features/select";

import { CreateClassFields } from "./types";

const ClassCreateForm = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const schoolId = searchParams.get("school");

	const targetSchoolResult = useSchoolsQuery({
		isEnabled: !!schoolId,
		queryType: "school-details",
		queryKey: ["school-details", { schoolId }],
		payload: { id: schoolId! },
	});

	const {
		selectedValue: selectedTutors,
		onChangeSelectedValue: onChangeSelectedTutors,
	} = useSelect<number[]>({
		defaultSelectedValue: [],
	});

	const { mutate: createGradeMutation } = useMutation<
		CreateGradeSuccessResponse,
		CreateGradeValidationError,
		CreateGrade
	>({
		mutationFn: createGrade,
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		setError,
		setValue,
	} = useForm<CreateClassFields>({
		resolver: zodResolver(createClassFormSchema),
	});

	useEffect(() => {
		if (targetSchoolResult) {
			const { id } = targetSchoolResult;

			setValue("school", id);
		}
	}, [targetSchoolResult, setValue]);

	useEffect(() => {
		setValue("tutor", selectedTutors);
	}, [selectedTutors, setValue]);

	const schoolsResult = useSchoolsQuery({
		isEnabled: true,
		queryKey: ["schools"],
		queryType: "schools",
		searchParams: {
			limit: 10000,
		},
	});

	const tutorsResult = useUsersQuery({
		isEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short"],
		searchParams: {
			limit: 10000,
			filter: getSelectedValue(USER_TYPES[UserTypesEnum.TUTOR]),
		},
	});

	const selectFormattedSchoolsOptions = getSelectFormattedSchoolsValues(
		schoolsResult?.results,
	);

	const selectFormattedTutorOptions = getSelectFormattedUserValues(
		tutorsResult?.results,
	);

	const submitFormHandler = (data: CreateClassFields) => {
		createGradeMutation(
			{ grade: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof CreateGradeValidationError["data"];
							setError(errorKey as keyof CreateClassFields, {
								message: errors[errorKey][0],
							});
						}
					}
				},
				onSuccess(result) {
					const { id } = result;

					navigate(`/classes/${id}`);
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit(submitFormHandler)} className="main-form">
			<div className="main-form__fields">
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.name,
					})}
				>
					<label
						htmlFor="name_of_class"
						className="main-form__label main-form__required"
					>
						Name of class
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
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.school,
					})}
				>
					<label
						htmlFor="school"
						className="main-form__label main-form__required"
					>
						School
					</label>
					<Controller
						name="school"
						control={control}
						render={({ field }) => (
							<SelectPicker
								className="select"
								{...field}
								cleanable={true}
								searchable={true}
								data={selectFormattedSchoolsOptions}
							/>
						)}
					/>
					{errors.school && (
						<p className="main-form__invalid-text">{errors.school?.message}</p>
					)}
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.year,
					})}
				>
					<label htmlFor="year_of_education" className="main-form__label">
						Year of Education
					</label>
					<input
						type="number"
						{...register("year")}
						className="main-form__input input"
					/>
					{errors.year && (
						<p className="main-form__invalid-text">{errors.year?.message}</p>
					)}
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.description,
					})}
				>
					<label htmlFor="year_of_education" className="main-form__label">
						Description
					</label>
					<input
						type="text"
						{...register("description")}
						className="main-form__input input"
					/>
					{errors.year && (
						<p className="main-form__invalid-text">
							{errors.description?.message}
						</p>
					)}
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.tutor,
					})}
				>
					<label htmlFor="tutors" className="main-form__label">
						Tutors
					</label>
					<MultiSelect
						selectedValues={selectedTutors}
						initialData={selectFormattedTutorOptions}
						onChangeSelectedValues={onChangeSelectedTutors}
					/>
					{errors.tutor && (
						<p className="main-form__invalid-text">{errors.tutor?.message}</p>
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
					Add class
				</button>
			</div>
		</form>
	);
};

export { ClassCreateForm };
