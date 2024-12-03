export interface Breadcrumb {
	label: string;
	path: string;
	isActive: boolean;
}

export interface BreadcrumbsProps {
	breadcrumbs: Breadcrumb[];
}