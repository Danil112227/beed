import { Timetable } from "@features/timetable";

import { TimetableTemplateTabProps } from "./types";

import "./TimetableTemplateTab.styles.scss";

function TimetableTemplateTab({
	isTimetableTemplateEditable,
}: TimetableTemplateTabProps) {
	return (
		<Timetable
			isTimetableTemplate={true}
			isTimetableTemplateEditable={isTimetableTemplateEditable}
		/>
	);
}

export { TimetableTemplateTab };
