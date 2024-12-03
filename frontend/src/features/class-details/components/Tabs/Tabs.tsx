import { useState } from "react";

import cn from "classnames";
import { useParams } from "react-router-dom";

import { useDialog, AddPeriodDialog } from "@features/dialog";

import { TimetableTab } from "../TimetableTab";
import { StudentsTab } from "../StudentsTab";
import { TimetableTemplateTab } from "../TimetableTemplateTab";

import { CLASS_TABS } from "@features/class-details/data/constants";

import { getListKey } from "@utils/list-key";

import { TabKey } from "@features/class-details/types";

import { TabsProps } from "./types";

import Plus from "@assets/vectors/blue-plus.svg?react";

const tabs: Record<
	TabKey,
	(isTimetableTemplateEditable?: boolean) => JSX.Element
> = {
	0: () => <TimetableTab />,
	1: () => <StudentsTab />,
	2: (isTimetableTemplateEditable?: boolean) => (
		<TimetableTemplateTab
			isTimetableTemplateEditable={isTimetableTemplateEditable || false}
		/>
	),
};

function Tabs({ canEditTimetableTemplate, canViewUserList }: TabsProps) {
	const [activeTab, setActiveTab] = useState<TabKey>(0);

	const { classId } = useParams();

	const {
		isVisible: isAddPeriodDialogVisible,
		onOpenDialog: onOpenAddPeriodDialog,
		onCloseDialog: onCloseAddPeriodDialog,
	} = useDialog();

	const filteredTabButtons = CLASS_TABS.filter(
		(tab) => (
			(tab.id === 2 && canEditTimetableTemplate) ||
			(tab.id === 1 && canViewUserList) ||
			(tab.id !== 2 && tab.id !== 1)
		),
	);

	const filteredTabs = Object.fromEntries(
		Object.entries(tabs).filter(
			([key]) => (
				(key === "2" && canEditTimetableTemplate) ||
				(key === "1" && canViewUserList) ||
				(key !== "2" && key !== "1")
			),
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
					{activeTab === 2 && canEditTimetableTemplate && (
						<button
							className="profile-tabs__add"
							onClick={onOpenAddPeriodDialog}
						>
							<span className="profile-tabs__add-text">Add period</span>
							<div className="profile-tabs__add-icon">
								<Plus />
							</div>
						</button>
					)}
				</div>
				<div className="profile-tabs__body">
					{Tab(canEditTimetableTemplate)}
				</div>
			</div>

			<AddPeriodDialog
				gradeId={classId}
				isVisible={isAddPeriodDialogVisible}
				onClose={onCloseAddPeriodDialog}
			/>
		</>
	);
}

export { Tabs };
