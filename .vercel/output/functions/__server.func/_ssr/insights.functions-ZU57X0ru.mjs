import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware, t as AppError } from "./errors-DaMHwKbb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights.functions-ZU57X0ru.js
var getInsights = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	return { days: [
		7,
		30,
		90
	].includes(Number(input?.days)) ? Number(input?.days) : 30 };
}).handler(createSsrRpc("fa7208156111f26b69819b4c047d8d4c1f213125f38b944e8cdbc216b24cf7c6"));
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const mode = String(input.mode ?? "steps");
	const text = String(input.text ?? "").trim();
	if (!text) throw new AppError("Write what you want help with first.");
	return {
		mode,
		text: text.slice(0, 4e3)
	};
}).handler(createSsrRpc("b54d9dce2173fd5edd99b6ce3eadccc1d6e668bbd080919ec1cfac24b3d3139a"));
var suggestTemplateFields = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ id: String(input.id ?? "") })).handler(createSsrRpc("d39b0608c1d19b67cecde3290a1039eadc15982b8c1ffd40c0c7280ff62ee571"));
//#endregion
export { getInsights as n, suggestTemplateFields as r, askAssistant as t };
