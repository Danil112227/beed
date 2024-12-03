import cn from "classnames";

import { Link } from "@components/common/Link";

import { getListKey } from "@utils/list-key";

import { BreadcrumbsProps } from "./types";

function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
	return (
		<div className="breadcrumbs">
			{breadcrumbs.map((breadcrumb, index) => (
				<Link
					key={getListKey("breadcrumb", index)}
					classes={cn("breadcrumbs__item", {
						breadcrumbs__link: breadcrumb.isActive,
					})}
					to={breadcrumb.path}
					autoScrollable={true}
					nav={false}
				>
					{breadcrumb.label}
				</Link>
			))}
		</div>
	);
}

export { Breadcrumbs };
