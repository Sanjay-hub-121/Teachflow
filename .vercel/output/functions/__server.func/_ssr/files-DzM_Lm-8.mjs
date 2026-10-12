//#region node_modules/.nitro/vite/services/ssr/assets/files-DzM_Lm-8.js
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("The file could not be read."));
		reader.onload = () => {
			const value = String(reader.result ?? "");
			resolve(value.slice(value.indexOf(",") + 1));
		};
		reader.readAsDataURL(file);
	});
}
function saveFile(filename, mime, base64) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
	const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function rememberPreviewToken(token) {
	if (!token || typeof window === "undefined") return;
	if (!window.location.hostname.endsWith(".grok-sandbox.com")) return;
	window.sessionStorage.setItem("grok-auth.bearer-token", token);
}
//#endregion
export { rememberPreviewToken as n, saveFile as r, fileToBase64 as t };
