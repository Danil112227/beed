import { Outlet } from "react-router-dom";

import "./App.styles.scss";

function App() {
	return (
		<div className="wrapper">
			<Outlet />
		</div>
	);
}

export { App };
