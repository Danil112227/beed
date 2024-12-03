import { useState } from "react";

import cn from "classnames";
import { useParams } from "react-router-dom";

import { ClassesTab } from "../ClassesTab";

import { Link } from "@components/common/Link";

import { SCHOOL_TABS } from "@features/school-details/data/constants";

import { getListKey } from "@utils/list-key";

import { TabKey } from "@features/school-details/types";
import { TabsProps } from "./types";

import Plus from "@assets/vectors/blue-plus.svg?react";

const tabs: Record<TabKey, () => JSX.Element> = {
	0: ClassesTab,
};

function Tabs({ canCreateClass }: TabsProps) {
	const [activeTab, setActiveTab] = useState<TabKey>(0);

	const { id } = useParams();

	const Tab = tabs[activeTab];

	let classesAddPath = "/classes/add";

	if (id) {
		classesAddPath += `?school=${id}`;
	}

	return (
		<div className="profile-tabs">
			<div className="profile-tabs__head">
				<ul className="profile-tabs__head-list">
					{SCHOOL_TABS.map((tab) => (
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
				{activeTab === 0 && canCreateClass && (
					<Link
						autoScrollable={true}
						nav={false}
						to={classesAddPath}
						classes="profile-tabs__add"
					>
						<span className="profile-tabs__add-text">Add class</span>
						<div className="profile-tabs__add-icon">
							<Plus />
						</div>
					</Link>
				)}
			</div>
			<div className="profile-tabs__body">
				<Tab />
			</div>
		</div>
	);
}

export { Tabs };
