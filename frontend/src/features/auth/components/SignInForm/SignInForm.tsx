import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	authorizeUser,
	userAuthSuccessResponseSchema,
	UserAuthResponse,
	SignInValidationError,
	AuthorizeUserParams,
} from "@api/services/auth";
import { useAuth } from "@features/auth/hooks/useAuth";

import { signInSchema } from "./schemas";

import { getInitPath } from "@features/auth/helpers/get-init-path";

import { SignInFields, SignInFormProps } from "./types";

function SignInForm({ onForgotPassword }: SignInFormProps) {
	const navigate = useNavigate();

	const { onLogin } = useAuth({});

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors },
	} = useForm<SignInFields>({
		resolver: zodResolver(signInSchema),
	});

	const { mutate: authorizeUserMutation } = useMutation<
		UserAuthResponse,
		SignInValidationError,
		AuthorizeUserParams
	>({
		mutationFn: authorizeUser,
	});

	const submitFormHandler = (data: SignInFields) => {
		const { username, password } = data;

		authorizeUserMutation(
			{ body: { username, password } },
			{
				onError(error) {
					const errors = error.data;
					for (const key in errors) {
						if (Object.prototype.hasOwnProperty.call(errors, key)) {
							const errorKey = key as keyof SignInValidationError["data"];
							setError("root", { message: errors[errorKey] });
						}
					}
				},
				onSuccess(data) {
					const validatedUserDetails =
						userAuthSuccessResponseSchema.safeParse(data);

					if (validatedUserDetails.success) {
						const { type } = validatedUserDetails.data;

						const redirectPath = getInitPath(type);

						navigate(redirectPath);

						onLogin(validatedUserDetails.data);
						reset();
					}
				},
			},
		);
	};

	return (
		<form className="main-form" onSubmit={handleSubmit(submitFormHandler)}>
			<div className="main-form__fields">
				<div className="main-form__col">
					<label htmlFor="login" className="main-form__label">
						Login
					</label>
					<input
						{...register("username")}
						id="login"
						type="text"
						className="main-form__input input"
						placeholder="Enter login"
					/>
				</div>
				<div className="main-form__col">
					<label htmlFor="password" className="main-form__label">
						Password
					</label>
					<input
						{...register("password")}
						id="password"
						type="password"
						className="main-form__input input"
						placeholder="Enter password"
					/>
				</div>
				{errors.root && (
					<p className="main-form__invalid-text">{errors.root?.message}</p>
				)}
			</div>

			<div className="main-form__buttons">
				<button type="submit" className="main-form__author-btn btn primary">
					Sign in
				</button>
				<button
					type="button"
					className="main-form__author-btn btn tertiary"
					onClick={onForgotPassword}
				>
					Forgot password
				</button>
			</div>
		</form>
	);
}

export { SignInForm };
