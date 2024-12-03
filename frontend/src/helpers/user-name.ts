export interface GetFullUserNameProps {
	firstName: string;
	lastName: string;
	patronymic?: string;
}

function getFullUserName({
	firstName,
	lastName,
	patronymic,
}: GetFullUserNameProps) {
	const userNameArr = [lastName, firstName, patronymic];

	const userName = userNameArr.filter(Boolean).join(" ");

	return userName;
}

export { getFullUserName };
