import { ReactNode, MouseEvent } from "react";

export interface LinkProps {
	nav: boolean;
	end?: boolean;
	to: string;
	classes?: string;
	children: ReactNode;
	autoScrollable: boolean;
	onClick?: (
		event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
	) => void;
}
