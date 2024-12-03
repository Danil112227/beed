import { ClassNameProps } from "./types";

function ClassName({ className }: ClassNameProps) {
	return <span className="user__name">{className} class</span>;
}

export { ClassName };
