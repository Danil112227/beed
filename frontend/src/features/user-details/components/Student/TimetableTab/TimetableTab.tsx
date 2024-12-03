import { Timetable } from "@features/timetable";

import { TimetableTabProps } from "./types";

function TimetableTab({ externalUserId }: TimetableTabProps) {
	return (
		<div className="profile-tabs__content active">
			<Timetable
				externalUserId={externalUserId}
				isTimetableTemplate={false}
				isTimetableTemplateEditable={false}
			/>
		</div>
	);
}

export { TimetableTab };
