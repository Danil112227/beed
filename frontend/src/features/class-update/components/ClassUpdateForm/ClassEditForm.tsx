import { useEffect } from "react";

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import cn from "classnames";

import { Link } from "@components/common/Link";

import { useUsersQuery, UserTypesEnum } from "@api/services/users";
import { useSchoolsQuery } from "@api/services/schools";
import {
	updateGrade,
	UpdateGrade,
	UpdateGradeSuccessResponse,
	UpdateGradeValidationError,
	useGradesQuery,
} from "@api/services/grade";

import { USER_TYPES } from "@features/users-list";
import {
	getSelectFormattedSchoolsValues,
	getSelectFormattedUserValues,
	getSelectedValue,
	MultiSelect,
	useSelect,
} from "@features/select";

import {
	createClassFormSchema,
	CreateClassFields,
} from "@features/class-create";

const ClassEditForm = () => {
	const { id } = useParams();
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

	const gradeDetailsResult = useGradesQuery({
		isEnabled: !!id,
		queryType: "grade-details",
		queryKey: ["grade-details", { gradeId: id }],
		payload: { id: id! },
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		setError,
		register,
	} = useForm<CreateClassFields>({
		resolver: zodResolver(createClassFormSchema),
		values: gradeDetailsResult && {
			name: gradeDetailsResult.name,
			year: gradeDetailsResult.year,
			school: gradeDetailsResult.school.id,
			tutor: gradeDetailsResult.tutor.map((tutor) => tutor.id),
			description: gradeDetailsResult.description,
		},
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

	useEffect(() => {
		if (gradeDetailsResult) {
			onChangeSelectedTutors(gradeDetailsResult.tutor.map((tutor) => tutor.id));
		}
	}, [onChangeSelectedTutors, gradeDetailsResult]);

	const { mutate: updateGradeMutation } = useMutation<
		UpdateGradeSuccessResponse,
		UpdateGradeValidationError,
		UpdateGrade
	>({
		mutationFn: updateGrade,
	});

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
		if (!id) {
			return;
		}

		updateGradeMutation(
			{ gradeId: id, grade: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof UpdateGradeValidationError["data"];
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

	if (!gradeDetailsResult) {
		return null;
	}

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
					Save
				</button>
			</div>
		</form>
	);
};

export { ClassEditForm };
