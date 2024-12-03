import { useCallback, useMemo, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import cn from "classnames";

import { Link } from "@components/common/Link";

import {
	useSchoolsQuery,
	updateSchool,
	UpdateSchool,
	UpdateSchoolSuccessResponse,
	UpdateSchoolValidationError,
} from "@api/services/schools";

import {
	createSchoolFormSchema,
	Periods,
	CreateSchoolFields,
} from "@features/school-create";

import { getSelectFormattedTimezoneValues } from "@features/select";

import { Nullable } from "@utils/types";

const SchoolEditForm = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const schoolDetailsResult = useSchoolsQuery({
		isEnabled: !!id,
		queryType: "school-details",
		queryKey: ["school-details", { userId: id }],
		payload: { id: id! },
	});

	const { mutate: createSchoolMutation } = useMutation<
		UpdateSchoolSuccessResponse,
		UpdateSchoolValidationError,
		UpdateSchool
	>({
		mutationFn: updateSchool,
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		setError,
		reset,
		getValues,
	} = useForm<CreateSchoolFields>({
		resolver: zodResolver(createSchoolFormSchema),
		values: schoolDetailsResult && {
			name: schoolDetailsResult.name,
			school_timezone: `${schoolDetailsResult.school_timezone_text}|${schoolDetailsResult.school_timezone}`,
			text: schoolDetailsResult.text,
			periods:
				schoolDetailsResult.periods?.map((period) => ({
					periodType: period.type,
					dates: [new Date(period.start_date), new Date(period.end_date)],
				})) || [],
			email: schoolDetailsResult.email,
			wats_app: schoolDetailsResult.wats_app,
			first_name: schoolDetailsResult.first_name,
			last_name: schoolDetailsResult.last_name,
		},
	});

	const selectFormattedTimezoneOptions = useMemo(
		() => getSelectFormattedTimezoneValues(),
		[],
	);

	const submitFormHandler = (data: CreateSchoolFields) => {
		if (!id) {
			return;
		}

		createSchoolMutation(
			{ school: data, schoolId: id },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof UpdateSchoolValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess(result) {
					const { id } = result;

					navigate(`/schools/${id}`);
				},
			},
		);
	};

	const changePeriodsHandler = useCallback(
		(periods: Nullable<CreateSchoolFields["periods"]>) => {
			if (!periods) {
				reset({ periods: undefined });
				return;
			}

			setValue("periods", periods);
		},
		[setValue, reset],
	);

	const periods = getValues("periods");

	const defaultSelectedTimezone = useMemo(() => {
		const schoolTimezone = schoolDetailsResult?.school_timezone;
		const schoolTimezoneText = schoolDetailsResult?.school_timezone_text;

		return selectFormattedTimezoneOptions.find((timezone) => {
			if (typeof schoolTimezone === "number") {
				const searchTimezone =
					schoolTimezone >= 0
						? `${schoolTimezoneText}|+${schoolTimezone}`
						: `${schoolTimezoneText}|-${schoolTimezone}`;

				return timezone.value.includes(searchTimezone);
			}

			return false;
		});
	}, [
		schoolDetailsResult?.school_timezone,
		schoolDetailsResult?.school_timezone_text,
		selectFormattedTimezoneOptions,
	]);

	useEffect(() => {
		if (defaultSelectedTimezone) {
			setValue("school_timezone", defaultSelectedTimezone.value);
		}
	}, [defaultSelectedTimezone, setValue]);

	return (
		<form onSubmit={handleSubmit(submitFormHandler)} className="main-form">
			<div className="main-form__fields">
				<div className="main-form__block">
					<h2 className="main-form__title">General information</h2>
					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.name,
						})}
					>
						<label
							htmlFor="name"
							className="main-form__label main-form__required"
						>
							Name of school
						</label>
						<input
							id="name"
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
							"main-form__invalid": errors.school_timezone,
						})}
					>
						<label
							htmlFor="school_timezone"
							className="main-form__label main-form__required"
						>
							Timezone
						</label>
						<Controller
							name="school_timezone"
							control={control}
							render={({ field }) => (
								<SelectPicker
									className="select"
									{...field}
									cleanable={true}
									searchable={true}
									data={selectFormattedTimezoneOptions}
								/>
							)}
						/>
						{errors.school_timezone && (
							<p className="main-form__invalid-text">
								{errors.school_timezone?.message}
							</p>
						)}
					</div>

					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.text,
						})}
					>
						<label
							htmlFor="description"
							className="main-form__label main-form__required"
						>
							Description
						</label>
						<textarea
							id="description"
							{...register("text")}
							className="main-form__input  main-form__textarea input"
							placeholder="Describe the school that you want to add"
						/>
						{errors.text && (
							<p className="main-form__invalid-text">{errors.text?.message}</p>
						)}
					</div>
				</div>

				<div className="main-form__block">
					<h2 className="main-form__title">Operating mode</h2>

					{periods && (
						<Periods
							errors={errors}
							defaultPeriods={periods}
							onPeriodsChange={changePeriodsHandler}
						/>
					)}
				</div>

				<div className="main-form__block">
					<h2 className="main-form__title">Contact information</h2>

					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.email,
						})}
					>
						<label htmlFor="email" className="main-form__label">
							Email
						</label>
						<input
							type="text"
							{...register("email")}
							className="main-form__input input"
						/>
						{errors.email && (
							<p className="main-form__invalid-text">{errors.email?.message}</p>
						)}
					</div>

					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.wats_app,
						})}
					>
						<label htmlFor="wats_app" className="main-form__label">
							WhatsApp
						</label>
						<input
							id="wats_app"
							type="text"
							{...register("wats_app")}
							className="main-form__input input"
						/>
						{errors.wats_app && (
							<p className="main-form__invalid-text">
								{errors.wats_app?.message}
							</p>
						)}
					</div>
					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.first_name,
						})}
					>
						<label htmlFor="first_name" className="main-form__label">
							First name
						</label>
						<input
							id="first_name"
							type="text"
							{...register("first_name")}
							className="main-form__input input"
						/>
						{errors.first_name && (
							<p className="main-form__invalid-text">
								{errors.first_name?.message}
							</p>
						)}
					</div>

					<div
						className={cn("main-form__col", {
							"main-form__invalid": errors.last_name,
						})}
					>
						<label htmlFor="last_name" className="main-form__label">
							Last name
						</label>
						<input
							id="last_name"
							type="text"
							{...register("last_name")}
							className="main-form__input input"
						/>
						{errors.last_name && (
							<p className="main-form__invalid-text">
								{errors.last_name?.message}
							</p>
						)}
					</div>
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

export { SchoolEditForm };
