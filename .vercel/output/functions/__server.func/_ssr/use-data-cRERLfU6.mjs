import { o as __toESM } from "../_runtime.mjs";
import { Q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as errorText } from "./errors-DaMHwKbb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-data-cRERLfU6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useData(load, deps) {
	const key = JSON.stringify(deps);
	const [tick, setTick] = (0, import_react.useState)(0);
	const [state, setState] = (0, import_react.useState)({
		status: "loading",
		data: null,
		error: "",
		unauthorized: false
	});
	(0, import_react.useEffect)(() => {
		let live = true;
		setState((current) => ({
			...current,
			status: current.data ? "ready" : "loading",
			error: ""
		}));
		load().then((data) => {
			if (live) setState({
				status: "ready",
				data,
				error: "",
				unauthorized: false
			});
		}).catch((error) => {
			if (!live) return;
			const unauthorized = error instanceof Error && error.message === "Unauthorized";
			setState({
				status: "error",
				data: null,
				unauthorized,
				error: unauthorized ? "Please sign in again." : errorText(error)
			});
		});
		return () => {
			live = false;
		};
	}, [key, tick]);
	return {
		...state,
		reload: () => setTick((value) => value + 1)
	};
}
//#endregion
export { useData as t };
