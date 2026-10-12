import { n as toast } from "../_libs/sonner.mjs";
import { r as errorText } from "./errors-DaMHwKbb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-Dhl2mSHk.js
async function attempt(work, success) {
	try {
		const value = await work();
		if (success) toast.success(success);
		return value;
	} catch (error) {
		toast.error(errorText(error));
		return null;
	}
}
//#endregion
export { attempt as t };
