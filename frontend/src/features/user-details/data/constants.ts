import { TabsData, TeacherTabsData } from "../types";
import { HomeworkTypesEnum, HomeworkStatusEnum } from "@api/services/homework";

export const USER_TABS: TabsData[] = [
	{ id: 0, title: "Timetable" },
	{ id: 1, title: "Materials" },
	{ id: 2, title: "Homework" },
	{ id: 3, title: "Projects" },
];

export const TACHER_USER_TABS: TeacherTabsData[] = [
	{ id: 0, title: "Timetable" },
	{ id: 1, title: "Homework" },
	{ id: 2, title: "Projects" },
];

export const HOMEWORK_TYPES = {
	[HomeworkTypesEnum.HOMEWORK]: "Homework",
	[HomeworkTypesEnum.PROJECT]: "Project",
};

export const HOMEWORK_STATUS = {
	[HomeworkStatusEnum.ASSIGNED]: "Assigned",
	[HomeworkStatusEnum.DONE]: "Done",
	[HomeworkStatusEnum.UNDER_REVIEW]: "Under review",
	[HomeworkStatusEnum.UNDONE]: "Undone",
};
