import {Route, Routes} from "react-router-dom";
import {Main} from "@/layout/Main.tsx";
import {routes} from "@/routes/routes.tsx";

export const AppRouter = () => {
	return (
		<Routes>
			<Route element={<Main/>}>
				{
					routes.map(route => (
						<Route key={route.path} element={route.element} path={route.path}/>
					))
				}
			</Route>
		</Routes>
	
	);
};