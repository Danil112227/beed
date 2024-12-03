import { FC, MouseEvent } from "react";

import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import cn from "classnames";
import { LinkProps } from "./types";

export const Link:FC<LinkProps>=({
	nav,
	end = true,
	to,
	classes,
	children,
	autoScrollable,
	onClick,
}) => {
	const scrollToTopHandler = () => {
		if (!autoScrollable) return;

		scroll({ top: 0, left: 0, behavior: "smooth" });
	};

	const clickHandler = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
		scrollToTopHandler();

		if (onClick) {
			onClick(event);
		}
	};

	if (nav) {
		return (
			<RouterNavLink
				to={to}
				onClick={clickHandler}
				className={({ isActive }) =>
					isActive ? cn(classes, "active") : classes
				}
				end={end}
			>
				{children}
			</RouterNavLink>
		);
	}

	return (
		<RouterLink
			to={to}
			onClick={clickHandler}
			className={classes}
			relative="route"
		>
			{children}
		</RouterLink>
	);
};