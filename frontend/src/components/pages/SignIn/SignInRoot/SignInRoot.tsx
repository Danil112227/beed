import { useState } from "react";

import { SignInForm, useAuth } from "@features/auth";

import signin from "../../../../assets/images/signin.jpg";

import Logo from "@assets/vectors/logo.svg?react";

import Inst from "@assets/vectors/inst.svg?react";
import Fb from "@assets/vectors/fb.svg?react";
import Tg from "@assets/vectors/tg.svg?react";

import "./SignInRoot.styles.scss";

function SignInRoot() {
	const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);

	useAuth({ isLogout: true });

	const toggleForgotPasswordVisibilityHandler = () => {
		setIsForgotPasswordVisible((prevState) => !prevState);
	};

	const forgotPasswordContent = (
		<div className="authorization">
			<div className="authorization__logo">
				<Logo />
			</div>
			<h1 className="main-title">Reset password</h1>
			<p>
				Please contact your administrator to restore the access to your account.
			</p>
			<div className="main-form__buttons">
				<button
					type="submit"
					className="main-form__author-btn btn primary"
					onClick={toggleForgotPasswordVisibilityHandler}
				>
					Go to sign in
				</button>
			</div>

			<div className="authorization__footer">
				<div className="authorization__soc">
					<button className="soc-icon">
						<Inst />
					</button>
					<button className="soc-icon">
						<Fb />
					</button>
					<button className="soc-icon">
						<Tg />
					</button>
				</div>
				<span>Copyright © 2024</span>
			</div>
		</div>
	);

	return (
		<>
			<section className="signin-section">
				<div className="signin-section__row">
					<div className="signin-section__col">
						<div className="signin-section__img">
							<img src={signin} alt="" />
						</div>
					</div>
					<div className="signin-section__col">
						{!isForgotPasswordVisible && (
							<div className="authorization">
								<div className="authorization__logo">
									<Logo />
								</div>
								<h1 className="main-title">Sign in</h1>
								<p>
									To sign in you need to request the login details from your
									administrator.
								</p>
								<SignInForm
									onForgotPassword={toggleForgotPasswordVisibilityHandler}
								/>

								<div className="authorization__footer">
									<div className="authorization__soc">
										<button className="soc-icon">
											<Inst />
										</button>
										<button className="soc-icon">
											<Fb />
										</button>
										<button className="soc-icon">
											<Tg />
										</button>
									</div>
									<span>Copyright © 2024</span>
								</div>
							</div>
						)}
						{isForgotPasswordVisible && forgotPasswordContent}
					</div>
				</div>
			</section>
		</>
	);
}

export { SignInRoot };
