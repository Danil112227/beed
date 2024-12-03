import { useEffect, useMemo } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectPicker } from "rsuite";
import { Calendar } from "primereact/calendar";
import cn from "classnames";

import { Link } from "@components/common/Link";
import {
	UserTypeRadio,
	createUserFormSchema,
	CreateUserFields,
} from "@features/user-create";

import {
	useUsersQuery,
	updateUser,
	UserTypesEnum,
	UpdateUserValidationError,
	UpdateUser,
	UpdateUserSuccessResponse,
} from "@api/services/users";

import {
	useSelect,
	MultiSelect,
	getSelectFormattedUserTypesValues,
	getSelectFormattedTimezoneValues,
	getSelectFormattedUserValues,
} from "@features/select";
import { getListKey } from "@utils/list-key";

function UserEditForm() {
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		selectedValue: selectedChilds,
		onChangeSelectedValue: onChangeSelectedChilds,
	} = useSelect<number[]>({
		defaultSelectedValue: [],
	});

	const userDetailsExtendedResult = useUsersQuery({
		isEnabled: !!id,
		queryType: "users-details-extended",
		queryKey: ["users-details-extended", { userId: id }],
		payload: { id: id! },
	});

	const { mutate: updateUserMutation } = useMutation<
		UpdateUserSuccessResponse,
		UpdateUserValidationError,
		UpdateUser
	>({
		mutationFn: updateUser,
	});

	const {
		control,
		formState: { errors },
		watch,
		handleSubmit,
		register,
		setError,
		setValue,
	} = useForm<CreateUserFields>({
		resolver: zodResolver(createUserFormSchema),
		values: userDetailsExtendedResult && {
			first_name: userDetailsExtendedResult.first_name,
			last_name: userDetailsExtendedResult.last_name,
			Patronymic: userDetailsExtendedResult.Patronymic,
			type: userDetailsExtendedResult.type,
			username: userDetailsExtendedResult.username,
			user_timezone: `${userDetailsExtendedResult.user_timezone_text}|${userDetailsExtendedResult.user_timezone}`,
			birthday: new Date(userDetailsExtendedResult.birthday),
			email: userDetailsExtendedResult.email,
			city: userDetailsExtendedResult.city,
			phone: userDetailsExtendedResult.phone,
			child: userDetailsExtendedResult.child.map((child) => child.id),
		},
	});

	useEffect(() => {
		setValue("child", selectedChilds);
	}, [selectedChilds, setValue]);

	useEffect(() => {
		if (userDetailsExtendedResult) {
			onChangeSelectedChilds(
				userDetailsExtendedResult.child.map((child) => child.id),
			);
		}
	}, [onChangeSelectedChilds, userDetailsExtendedResult]);

	const submitFormHandler = (data: CreateUserFields) => {
		if (!id) {
			return;
		}

		updateUserMutation(
			{ id, user: data },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof UpdateUserValidationError["data"];
							setError(errorKey, { message: errors[errorKey][0] });
						}
					}
				},
				onSuccess() {
					navigate(`/users`);
				},
			},
		);
	};

	const usersResult = useUsersQuery({
		isEnabled: true,
		isPaginationEnabled: true,
		queryType: "users-short",
		queryKey: ["users-short"],
		searchParams: {
			limit: 10000,
		},
	});

	const currentUserType = watch("type");
	const isUserParent = currentUserType === UserTypesEnum.PARENT;

	const radioFormattedUserTypesOptions = getSelectFormattedUserTypesValues();
	const selectFormattedTimezoneOptions = useMemo(
		() => getSelectFormattedTimezoneValues(),
		[],
	);
	const selectFormattedUserOptions = getSelectFormattedUserValues(
		usersResult?.results,
	);

	const defaultSelectedTimezone = useMemo(() => {
		const userTimezone = userDetailsExtendedResult?.user_timezone;
		const userTimezoneText = userDetailsExtendedResult?.user_timezone_text;

		return selectFormattedTimezoneOptions.find((timezone) => {
			if (typeof userTimezone === "number") {
				const searchTimezone =
					userTimezone >= 0
						? `${userTimezoneText}|+${userTimezone}`
						: `${userTimezoneText}|-${userTimezone}`;

				return timezone.value.includes(searchTimezone);
			}

			return false;
		});
	}, [
		userDetailsExtendedResult?.user_timezone_text,
		userDetailsExtendedResult?.user_timezone,
		selectFormattedTimezoneOptions,
	]);

	useEffect(() => {
		if (defaultSelectedTimezone) {
			setValue("user_timezone", defaultSelectedTimezone.value);
		}
	}, [defaultSelectedTimezone, setValue]);

	if (!userDetailsExtendedResult) {
		return null;
	}

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
						"main-form__invalid": errors.birthday,
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
					Edit user
				</button>
			</div>
		</form>
	);
}

export { UserEditForm };
