import { DocumentItemProps } from "./types";

import Dwnl from "@assets/vectors/download.svg?react";

function DocumentItem({ document }: DocumentItemProps) {
	const { file } = document;

	const foundExtension = file.match(/.+(\.)(?<extension>\w+)/);

	let extention = "NONE";

	if (foundExtension && foundExtension.groups) {
		extention = foundExtension.groups?.extension;
	}

	return (
		<div className="material__item">
			<div className="material__item-type material__item-type--pdf">
				{extention.toUpperCase()}
			</div>
			<span className="material__item-name">{file}</span>
			<a className="material__item-btn" href={file}>
				<Dwnl />
			</a>
		</div>
	);
}

export { DocumentItem };
