export interface GetFullSchoolNameProps {
	name: string;
}

function SchoolName({ name }: GetFullSchoolNameProps) {
	return <span className="user__name">{name}</span>;
}

export { SchoolName };
