import { Timetable } from "@features/timetable";

import "./TimetableTab.styles.scss";

function TimetableTab() {
	return (
		<Timetable
			isTimetableTemplate={false}
			isTimetableTemplateEditable={false}
		/>
	);
}

export { TimetableTab };
