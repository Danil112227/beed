import { useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import cn from "classnames";

import { Link } from "@components/common/Link";

import {
	createSchool,
	CreateSchool,
	CreateSchoolValidationError,
	CreateSchoolSuccessResponse,
} from "@api/services/schools";

import { createSchoolFormSchema } from "./schemas";

import { getSelectFormattedTimezoneValues } from "@features/select";

import { Periods } from "../Periods";

import { CreateSchoolFields } from "./types";
import { Nullable } from "@utils/types";

const SchoolCreateForm = () => {
	const navigate = useNavigate();

	const { mutate: createSchoolMutation } = useMutation<
		CreateSchoolSuccessResponse,
		CreateSchoolValidationError,
		CreateSchool
	>({
		mutationFn: createSchool,
	});

	const {
		control,
		formState: { errors },
		handleSubmit,
		register,
		setValue,
		setError,
		reset,
	} = useForm<CreateSchoolFields>({
		resolver: zodResolver(createSchoolFormSchema),
	});

	const selectFormattedTimezoneOptions = getSelectFormattedTimezoneValues();

	const submitFormHandler = (data: CreateSchoolFields) => {
		createSchoolMutation(
			{ school: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof CreateSchoolValidationError["data"];
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

					<Periods
						errors={errors}
						defaultPeriods={[]}
						onPeriodsChange={changePeriodsHandler}
					/>
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
					Add school
				</button>
			</div>
		</form>
	);
};

export { SchoolCreateForm };
