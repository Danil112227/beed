import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import { register } from "swiper/element/bundle";

import { AuthContextProvider } from "@features/auth";

import { registerPrimeLocales } from "./lib/primereact";

import { router } from "./routes";
import { queryClient } from "./query";

import "normalize.css";
import "rsuite/dist/rsuite.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-calendar/dist/Calendar.css";
import "@styles/index.scss";

register();
registerPrimeLocales();

const rootElement = document.getElementById("root") as HTMLDivElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<PrimeReactProvider>
				<AuthContextProvider>
					<RouterProvider router={router} />
				</AuthContextProvider>
			</PrimeReactProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
