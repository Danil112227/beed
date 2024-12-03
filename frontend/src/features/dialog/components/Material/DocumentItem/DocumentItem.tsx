import { DocumentItemProps } from "./types";

import Cross from "@assets/vectors/cross.svg?react";

function DocumentItem({ document, onRemoveDocument }: DocumentItemProps) {
	const { file, id } = document;

	const foundExtension = file.match(/.+(\.)(?<extension>\w+)/);

	let extention = "NONE";

	if (foundExtension && foundExtension.groups) {
		extention = foundExtension.groups?.extension;
	}

	return (
		<div className="main-form__file-col">
			<div className="main-form__file">
				<div className="material__item">
					<div className="material__item-type material__item-type--mp4">
						{extention}
					</div>
					<span className="material__item-name">{file}</span>
					<button
						type="button"
						className="material__item-btn"
						onClick={() => onRemoveDocument([id])}
					>
						<Cross />
					</button>
				</div>
			</div>
		</div>
	);
}

export { DocumentItem };
