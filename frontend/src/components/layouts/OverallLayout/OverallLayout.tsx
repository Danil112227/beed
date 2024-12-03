import { Outlet } from "react-router-dom";
import { Header } from "@features/header";

function OverallLayout() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}

export { OverallLayout };
