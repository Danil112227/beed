import { HideAuthGuard, useAuth } from "@features/auth";
import { UserTypesEnum, RoleGuard } from "@features/role-access";

import { Profile } from "../Profile";

import { Link } from "@components/common/Link";

import Logo from "@assets/vectors/logo.svg?react";

import "./Header.styles.scss";

function Header() {
	const { isAuthLoading, isAuthenticated, user } = useAuth({});

	if (isAuthLoading || !isAuthenticated || !user) {
		return null;
	}

	const { type } = user;

	const isStudent = type === UserTypesEnum.STUDENT;

	const studentHeaderContent = (
		<ul className="nav__list">
			<li className="nav__item">
				<Link
					classes="nav__btn"
					nav={false}
					autoScrollable={true}
					to="/student/timetable"
				>
					Timetable
				</Link>
			</li>
			<li className="nav__item">
				<Link
					classes="nav__btn"
					nav={false}
					autoScrollable={true}
					to="/student/homework"
				>
					Homework
				</Link>
			</li>
			<li className="nav__item">
				<Link
					classes="nav__btn"
					nav={false}
					autoScrollable={true}
					to="/student/materials"
				>
					Materials
				</Link>
			</li>
			<li className="nav__item">
				<Link
					classes="nav__btn"
					nav={false}
					autoScrollable={true}
					to="/student/projects"
				>
					Projects
				</Link>
			</li>
		</ul>
	);

	return (
		<header className="header">
			<div className="container">
				<div className="header__row">
					<div className="logo">
						<Logo />
					</div>

					<nav className="nav">
						{isStudent && studentHeaderContent}
						{!isStudent && (
							<ul className="nav__list">
								<RoleGuard roles={[]} permissions={["can_view_school"]}>
									<li className="nav__item">
										<Link
											classes="nav__btn"
											nav={false}
											autoScrollable={true}
											to="/schools"
										>
											School
										</Link>
									</li>
								</RoleGuard>
								<RoleGuard roles={[]} permissions={["can_view_users"]}>
									<li className="nav__item">
										<Link
											classes="nav__btn"
											nav={false}
											autoScrollable={true}
											to="/users"
										>
											Users
										</Link>
									</li>
								</RoleGuard>
								<RoleGuard roles={[]} permissions={["can_view_classes"]}>
									<li className="nav__item">
										<Link
											classes="nav__btn"
											nav={false}
											autoScrollable={true}
											to="/classes"
										>
											Classes
										</Link>
									</li>
								</RoleGuard>
							</ul>
						)}
					</nav>

					<HideAuthGuard>
						<Profile />
					</HideAuthGuard>
				</div>
			</div>
		</header>
	);
}

export { Header };
