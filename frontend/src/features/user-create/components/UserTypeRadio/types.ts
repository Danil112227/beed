import { ControllerRenderProps } from "react-hook-form";

import { UserTypesEnum } from "@api/services/users";

import { CreateUserFields } from "../UserCreateForm";

export interface UserTypeRadioProps {
	field: ControllerRenderProps<CreateUserFields, "type">;
	value: UserTypesEnum;
	label: string;
}