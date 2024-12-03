import { useState } from "react";

import cn from "classnames";

import { TimetableTab } from "../TimetableTab";
import { MaterialsTab } from "../MaterialsTab";
import { HomeworkTab } from "../HomeworkTab";
import { ProjectsTab } from "../ProjectsTab";

import { useDialog, AddMaterialDialog } from "@features/dialog";

import { USER_TABS } from "@features/user-details/data/constants";

import { getListKey } from "@utils/list-key";

import { TabKey } from "@features/user-details/types";

import Plus from "@assets/vectors/blue-plus.svg?react";

const tabs: Record<TabKey, () => JSX.Element> = {
	0: () => <TimetableTab />,
	1: () => <MaterialsTab />,
	2: () => <HomeworkTab />,
	3: () => <ProjectsTab />,
};

function Tabs() {
	const [activeTab, setActiveTab] = useState<TabKey>(0);

	const {
		isVisible: isAddMaterialDialogVisible,
		onOpenDialog: onOpenAddMaterialDialog,
		onCloseDialog: onCloseAddMaterialDialog,
	} = useDialog();

	const Tab = tabs[activeTab];

	return (
		<>
			<div className="profile-tabs">
				<div className="profile-tabs__head">
					<ul className="profile-tabs__head-list">
						{USER_TABS.map((tab) => (
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
					{activeTab === 1 && (
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
				</div>
				<div className="profile-tabs__body">
					<Tab />
				</div>
			</div>

			<AddMaterialDialog
				isVisible={isAddMaterialDialogVisible}
				onClose={onCloseAddMaterialDialog}
			/>
		</>
	);
}

export { Tabs };
