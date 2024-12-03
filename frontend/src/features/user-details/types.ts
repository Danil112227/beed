export type TabKey = 0 | 1 | 2 | 3;

export type TeacherTabKey = 0 | 1 | 2;

export interface TabsData {
	id: TabKey;
	title: string;
}

export interface TeacherTabsData {
	id: TeacherTabKey;
	title: string;
}
