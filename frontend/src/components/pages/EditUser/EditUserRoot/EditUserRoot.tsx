import { UserEditForm } from "@features/user-update";
import { useParams } from "react-router-dom";

import { Breadcrumbs, Breadcrumb } from "@features/breadcrumbs";

function EditUserRoot() {
	const { id } = useParams();

	const breadcrumbs: Breadcrumb[] = [
		{ label: "Users", path: "/users", isActive: true },
		{ label: `Edit user`, path: `/users/edit/${id}`, isActive: false },
	];
	return (
		<div className="section add-user-section">
			<div className="container">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<h1 className="main-title">Edit user</h1>
				<UserEditForm />
			</div>
		</div>
	);
}

export { EditUserRoot };
