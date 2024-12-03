import { UserCreateForm } from "@features/user-create";

import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function AddUserRoot() {
	const breadcrumbs: Breadcrumb[] = [
		{ label: "Users", path: "/users", isActive: true },
		{ label: "Add user", path: `/users/add`, isActive: false },
	];
	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Add user</h1>
				<UserCreateForm />
			</div>
		</div>
	);
}

export { AddUserRoot };
