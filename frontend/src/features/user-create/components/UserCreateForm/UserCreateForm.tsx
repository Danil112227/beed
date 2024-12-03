import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import { Calendar } from "primereact/calendar";
import cn from "classnames";

import { Link } from "@components/common/Link";

import { UserTypeRadio } from "../UserTypeRadio";

import { createUserFormSchema } from "./schemas";
import {
	useUsersQuery,
	createUser,
	UserTypesEnum,
	CreateUserValidationError,
	CreateUser,
	CreateUserSuccessResponse,
} from "@api/services/users";
import { USER_TYPES } from "@features/users-list";

import {
	useSelect,
	MultiSelect,
	getSelectFormattedUserTypesValues,
	getSelectFormattedTimezoneValues,
	getSelectFormattedUserValues,
} from "@features/select";
import { getListKey } from "@utils/list-key";

import { CreateUserFields } from "./types";

const UserCreateForm = () => {
	const {
		selectedValue: selectedChilds,
		onChangeSelectedValue: onChangeSelectedChilds,
	} = useSelect<number[]>({
		defaultSelectedValue: [],
	});

	const navigate = useNavigate();

	const { mutate: createUserMutation } = useMutation<
		CreateUserSuccessResponse,
		CreateUserValidationError,
		CreateUser
	>({
		mutationFn: createUser,
	});

	const {
		control,
		formState: { errors },
		watch,
		handleSubmit,
		register,
		setValue,
		setError,
	} = useForm<CreateUserFields>({
		resolver: zodResolver(createUserFormSchema),
		defaultValues: { type: UserTypesEnum.STUDENT },
	});

	useEffect(() => {
		setValue("child", selectedChilds);
	}, [selectedChilds, setValue]);

	const usersResult = useUsersQuery({
		isEnabled: true,
		isPaginationEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short"],
		searchParams: {
			limit: 10000,
			filter: USER_TYPES[UserTypesEnum.STUDENT],
		},
	});

	const currentUserType = watch("type");
	const isUserParent = currentUserType === UserTypesEnum.PARENT;

	const radioFormattedUserTypesOptions = getSelectFormattedUserTypesValues();
	const selectFormattedTimezoneOptions = getSelectFormattedTimezoneValues();
	const selectFormattedUserOptions = getSelectFormattedUserValues(
		usersResult?.results,
	);

	const submitFormHandler = (data: CreateUserFields) => {
		createUserMutation(
			{ user: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof CreateUserValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess(result) {
					const { id } = result;

					navigate(`/users/edit/${id}`);
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit(submitFormHandler)} className="main-form">
			<div className="main-form__fields">
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.first_name,
					})}
				>
					<label
						htmlFor="first_name"
						className="main-form__label main-form__required"
					>
						First name
					</label>
					<input
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
					<label
						htmlFor="last_name"
						className="main-form__label main-form__required"
					>
						Last name
					</label>
					<input
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
				<div className="main-form__col">
					<label htmlFor="Patronymic" className="main-form__label">
						Patronymic
					</label>
					<input
						type="text"
						{...register("Patronymic")}
						className="main-form__input input"
					/>
				</div>
				<div className={cn("main-form__col")}>
					<label
						htmlFor="type"
						className="main-form__label main-form__required"
					>
						Type of user
					</label>
					<div className="main-form__row">
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<>
									{radioFormattedUserTypesOptions.map((type) => (
										<UserTypeRadio
											field={field}
											value={type.value}
											label={type.label}
											key={getListKey("user-type", type.value)}
										/>
									))}
								</>
							)}
						/>
					</div>
					{errors.type && (
						<p className="main-form__invalid-text">{errors.type?.message}</p>
					)}
				</div>
				{isUserParent && (
					<div className={cn("main-form__col")}>
						<label htmlFor="child" className="main-form__label">
							Child
						</label>
						<MultiSelect
							selectedValues={selectedChilds}
							initialData={selectFormattedUserOptions}
							onChangeSelectedValues={onChangeSelectedChilds}
						/>
					</div>
				)}
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.username,
					})}
				>
					<label
						htmlFor="username"
						className="main-form__label main-form__required"
					>
						Login
					</label>
					<input
						type="text"
						{...register("username")}
						className="main-form__input input"
					/>
					{errors.username && (
						<p className="main-form__invalid-text">
							{errors.username?.message}
						</p>
					)}
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.user_timezone,
					})}
				>
					<label
						htmlFor="user_timezone"
						className="main-form__label main-form__required"
					>
						Timezone
					</label>
					<Controller
						name="user_timezone"
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
					{errors.user_timezone && (
						<p className="main-form__invalid-text">
							{errors.user_timezone?.message}
						</p>
					)}
					<p className="main-form__info">
						If timezone is not specified for the user, it will be obtained from
						the school which they are affiliated.
					</p>
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": !!errors.birthday?.message,
					})}
				>
					<label
						htmlFor="birthday"
						className="main-form__label main-form__required"
					>
						Date of birth
					</label>
					<Controller
						name="birthday"
						control={control}
						render={({ field }) => (
							<Calendar
								className="calendar input"
								dateFormat="dd.mm.yy"
								{...field}
							/>
						)}
					/>
					{errors.birthday && (
						<p className="main-form__invalid-text">
							{errors.birthday?.message}
						</p>
					)}
				</div>
				<div
					className={cn("main-form__col", {
						"main-form__invalid": errors.email,
					})}
				>
					<label
						htmlFor="email"
						className="main-form__label main-form__required"
					>
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
				<div className="main-form__col">
					<label htmlFor="city" className="main-form__label">
						City
					</label>
					<input
						type="text"
						{...register("city")}
						className="main-form__input input"
					/>
				</div>
				<div className="main-form__col">
					<label htmlFor="phone" className="main-form__label">
						Phone
					</label>
					<input
						type="text"
						{...register("phone")}
						className="main-form__input input"
					/>
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
					Add user
				</button>
			</div>
		</form>
	);
};

export { UserCreateForm };
