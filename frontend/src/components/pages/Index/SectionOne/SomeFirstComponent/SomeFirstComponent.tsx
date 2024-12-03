import { SomeFirstComponentProps } from "./types";

import "./SomeFirstComponent.styles.scss";

function SomeFirstComponent({ name }: SomeFirstComponentProps) {
	return <div>SomeFirstComponent: {name}</div>;
}

export { SomeFirstComponent };
