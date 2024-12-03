import { useState } from "react";

import cn from "classnames";

import { TimetableTab } from "../TimetableTab";
import { HomeworkTab } from "../HomeworkTab";
import { ProjectsTab } from "../ProjectsTab";

import { useDialog, AddMaterialDialog } from "@features/dialog";
import { useAuth } from "@features/auth";

import { TACHER_USER_TABS } from "@features/user-details/data/constants";

import { getListKey } from "@utils/list-key";

import { TeacherTabKey } from "@features/user-details/types";

const tabs: Record<TeacherTabKey, (externalUserId: number) => JSX.Element> = {
	0: (externalUserId: number) => (
		<TimetableTab externalUserId={externalUserId} />
	),
	1: (externalUserId: number) => (
		<HomeworkTab externalUserId={externalUserId} />
	),
	2: (externalUserId: number) => (
		<ProjectsTab externalUserId={externalUserId} />
	),
};

function TeacherTabs() {
	const [activeTab, setActiveTab] = useState<TeacherTabKey>(0);

	const {
		isVisible: isAddMaterialDialogVisible,
		onCloseDialog: onCloseAddMaterialDialog,
	} = useDialog();

	const { user } = useAuth({});

	const Tab = tabs[activeTab];

	if (!user) {
		return null;
	}

	const { id } = user;

	return (
		<>
			<div className="profile-tabs">
				<div className="profile-tabs__head">
					<ul className="profile-tabs__head-list">
						{TACHER_USER_TABS.map((tab) => (
							<li
								key={getListKey("tab", tab.id)}
								className={cn("profile-tabs__head-item", {
									active: tab.id === activeTab,
								})}
								onClick={() => setActiveTab(tab.id)}
							>
								{tab.title}
							</li>
						))}
					</ul>
				</div>
				<div className="profile-tabs__body">{Tab(id)}</div>
			</div>

			<AddMaterialDialog
				isVisible={isAddMaterialDialogVisible}
				onClose={onCloseAddMaterialDialog}
			/>
		</>
	);
}

export { TeacherTabs };
