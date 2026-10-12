//#region node_modules/.nitro/vite/services/ssr/assets/fields-yzKHtmUG.js
var FIELD_TYPES = [
	"text",
	"textarea",
	"number",
	"date",
	"select",
	"checkbox",
	"repeat",
	"lines"
];
var KEY_RE = /^[a-z][a-z0-9_]{0,40}$/;
function slugKey(label, used) {
	const raw = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32);
	let base = raw && /^[a-z]/.test(raw) ? raw : `field_${raw || "item"}`.replace(/^field_field_/, "field_");
	base = base.slice(0, 40);
	let key = base;
	let n = 2;
	while (used.has(key) || !KEY_RE.test(key)) key = `${base.slice(0, 34)}_${n++}`;
	used.add(key);
	return key;
}
function isFieldType(value) {
	return FIELD_TYPES.includes(value);
}
function sanitizeFields(input) {
	if (!Array.isArray(input)) return [];
	const used = /* @__PURE__ */ new Set();
	const fields = [];
	for (const item of input) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		const label = String(row.label ?? "").trim().slice(0, 80);
		if (!label) continue;
		const requested = String(row.key ?? "").trim();
		const key = KEY_RE.test(requested) && !used.has(requested) ? requested : slugKey(label, used);
		if (KEY_RE.test(requested)) used.add(key);
		const type = isFieldType(String(row.type)) ? String(row.type) : "text";
		const field = {
			key,
			label,
			type,
			required: Boolean(row.required)
		};
		if (Array.isArray(row.options)) field.options = row.options.map((option) => String(option).trim()).filter(Boolean).slice(0, 20);
		for (const prop of [
			"token",
			"anchor",
			"sheet",
			"cell",
			"pdfField",
			"help"
		]) {
			const value = String(row[prop] ?? "").trim();
			if (value) field[prop] = value.slice(0, prop === "help" || prop === "anchor" ? 240 : 80);
		}
		if (type === "repeat") {
			field.itemFields = sanitizeFields(row.itemFields).filter((child) => child.type !== "repeat");
			if (field.itemFields.length === 0) field.itemFields = [{
				key: "text",
				label: "Text",
				type: "textarea",
				required: true
			}];
		}
		fields.push(field);
	}
	return fields.slice(0, 40);
}
function validateFormData(fields, data) {
	const source = data && typeof data === "object" ? data : {};
	const errors = {};
	const value = {};
	for (const field of fields) {
		const raw = source[field.key];
		if (field.type === "checkbox") {
			value[field.key] = raw === true || raw === "true" || raw === "yes";
			continue;
		}
		if (field.type === "repeat") {
			const rows = Array.isArray(raw) ? raw : [];
			const clean = [];
			rows.forEach((row, index) => {
				const record = row && typeof row === "object" ? row : {};
				const next = {};
				for (const child of field.itemFields ?? []) {
					const text = String(record[child.key] ?? "").trim();
					if (child.required && !text) errors[`${field.key}.${index}.${child.key}`] = `${child.label} is required.`;
					if (child.type === "number" && text && !Number.isFinite(Number(text))) errors[`${field.key}.${index}.${child.key}`] = `${child.label} must be a number.`;
					next[child.key] = text.slice(0, 2e3);
				}
				if (Object.values(next).some(Boolean)) clean.push(next);
			});
			if (field.required && clean.length === 0) errors[field.key] = `Add at least one ${field.label.toLowerCase()}.`;
			value[field.key] = clean;
			continue;
		}
		const text = raw == null ? "" : String(raw).trim();
		if (field.required && !text) errors[field.key] = `${field.label} is required.`;
		if (field.type === "number" && text && !Number.isFinite(Number(text))) errors[field.key] = `${field.label} must be a number.`;
		if (field.type === "date" && text && !/^\d{4}-\d{2}-\d{2}$/.test(text)) errors[field.key] = `${field.label} must be a date.`;
		if (field.type === "select" && text && field.options && field.options.length > 0 && !field.options.includes(text)) errors[field.key] = `Choose a valid ${field.label.toLowerCase()}.`;
		value[field.key] = text.slice(0, field.type === "textarea" || field.type === "lines" ? 8e3 : 500);
	}
	return Object.keys(errors).length ? {
		ok: false,
		errors
	} : {
		ok: true,
		value
	};
}
function emptyForm(fields) {
	const value = {};
	for (const field of fields) if (field.type === "checkbox") value[field.key] = false;
	else if (field.type === "repeat") value[field.key] = [];
	else value[field.key] = "";
	return value;
}
//#endregion
export { validateFormData as a, slugKey as i, emptyForm as n, sanitizeFields as r, FIELD_TYPES as t };
