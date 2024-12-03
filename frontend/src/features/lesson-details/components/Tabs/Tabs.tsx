import { useState } from "react";

import cn from "classnames";

import { MaterialsTab } from "../MaterialsTab";
import { StudentsTab } from "../StudentsTab";
import { HomeworksTab } from "../HomeworksTab";

import { LESSON_TABS } from "@features/lesson-details/data/constants";
import {
	AddMaterialDialog,
	AddHomeworkDialog,
	useDialog,
} from "@features/dialog";

import { getListKey } from "@utils/list-key";

import { TabKey } from "@features/class-details/types";
import { TabsProps } from "./types";

import Plus from "@assets/vectors/blue-plus.svg?react";

const tabs: Record<TabKey, () => JSX.Element> = {
	0: () => <MaterialsTab />,
	1: () => <HomeworksTab />,
	2: () => <StudentsTab />,
};

function Tabs({ canEditStudentList, canEdit }: TabsProps) {
	const [activeTab, setActiveTab] = useState<TabKey>(0);

	const {
		isVisible: isAddMaterialDialogVisible,
		onOpenDialog: onOpenAddMaterialDialog,
		onCloseDialog: onCloseAddMaterialDialog,
	} = useDialog();

	const {
		isVisible: isAddHomeworkDialogVisible,
		onOpenDialog: onOpenAddHomeworkDialog,
		onCloseDialog: onCloseAddHomeworkDialog,
	} = useDialog();

	const filteredTabButtons = LESSON_TABS.filter(
		(tab) => (tab.id === 2 && canEditStudentList) || tab.id !== 2,
	);

	const filteredTabs = Object.fromEntries(
		Object.entries(tabs).filter(
			([key]) => (key === "2" && canEditStudentList) || key !== "2",
		),
	);

	const Tab = filteredTabs[activeTab];

	return (
		<>
			<div className="profile-tabs">
				<div className="profile-tabs__head">
					<ul className="profile-tabs__head-list">
						{filteredTabButtons.map((tab) => (
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
					{activeTab === 0 && canEdit && (
						<button
							className="profile-tabs__add"
							onClick={onOpenAddMaterialDialog}
						>
							<span className="profile-tabs__add-text">Add material</span>
							<div className="profile-tabs__add-icon">
								<Plus />
							</div>
						</button>
					)}
					{activeTab === 1 && canEdit && (
						<button
							className="profile-tabs__add"
							onClick={onOpenAddHomeworkDialog}
						>
							<span className="profile-tabs__add-text">Add homework</span>
							<div className="profile-tabs__add-icon">
								<Plus />
							</div>
						</button>
					)}
				</div>
				<div className="profile-tabs__body">
					<Tab />
				</div>
			</div>

			<AddMaterialDialog
				isVisible={isAddMaterialDialogVisible}
				onClose={onCloseAddMaterialDialog}
			/>

			<AddHomeworkDialog
				isVisible={isAddHomeworkDialogVisible}
				onClose={onCloseAddHomeworkDialog}
			/>
		</>
	);
}

export { Tabs };
