export interface TimetableEvent {
	start?: Date;
	end?: Date;
	data?: TimetableEventRegular | MasterTimetableEventRegular;
	resourceId?: number;
}

interface TimetableEventRegular {
	type: "regular";
	gradeId: number;
	lessonId: number;
	title: string;
	teacherName: string;
}

interface MasterTimetableEventRegular {
	type: "master-regular";
	masterLessonId: number;
	title: string;
	teacherName: string;
}

export interface TimetableProps {
	isTimetableTemplate: boolean;
	externalUserId?: number;
	isTimetableTemplateEditable: boolean;
}
