import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Select, d as TextInput, i as Field, t as Button, u as TextArea } from "./ui-NXfbhcwX.mjs";
import { t as FIELD_TYPES } from "./fields-yzKHtmUG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fields-ui-DMaWq6_0.js
var import_jsx_runtime = require_jsx_runtime();
var TYPE_LABEL = {
	text: "Short text",
	textarea: "Long text",
	number: "Number",
	date: "Date",
	select: "Choice",
	checkbox: "Yes or no",
	repeat: "Repeating rows",
	lines: "Lines"
};
function patchField(fields, index, patch) {
	return fields.map((field, position) => position === index ? {
		...field,
		...patch
	} : field);
}
function FieldSchemaEditor({ fields, onChange }) {
	const add = () => {
		const used = new Set(fields.map((field) => field.key));
		let n = fields.length + 1;
		let key = `field_${n}`;
		while (used.has(key)) key = `field_${++n}`;
		onChange([...fields, {
			key,
			label: "New field",
			type: "text",
			required: false
		}]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			fields.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No fields yet. Add one, or use the suggestions from the file."
			}) : null,
			fields.map((field, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-lg border border-line bg-paper p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Label",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
								value: field.label,
								onChange: (event) => onChange(patchField(fields, index, { label: event.target.value }))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Type",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: field.type,
								onChange: (event) => {
									const type = event.target.value;
									const next = { type };
									if (type === "repeat" && !field.itemFields?.length) next.itemFields = [{
										key: "text",
										label: "Text",
										type: "textarea",
										required: true
									}];
									onChange(patchField(fields, index, next));
								},
								children: FIELD_TYPES.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: type,
									children: TYPE_LABEL[type]
								}, type))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "size-4 accent-primary",
							checked: field.required,
							onChange: (event) => onChange(patchField(fields, index, { required: event.target.checked }))
						}), "Required before a document can be generated"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded-md border border-line bg-card px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "flex min-h-11 cursor-pointer items-center text-sm font-semibold",
							children: "Where this goes in the file"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 pb-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Placeholder",
									hint: "Matches {{name}} in the file. Leave blank if you use a phrase or a cell.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: field.token ?? "",
										onChange: (event) => onChange(patchField(fields, index, { token: event.target.value }))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Exact phrase to replace",
									hint: "Only if the file has no placeholder, and the phrase appears once.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: field.anchor ?? "",
										onChange: (event) => onChange(patchField(fields, index, { anchor: event.target.value }))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Sheet",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: field.sheet ?? "",
										onChange: (event) => onChange(patchField(fields, index, { sheet: event.target.value }))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Cell",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: field.cell ?? "",
										onChange: (event) => onChange(patchField(fields, index, { cell: event.target.value }))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "PDF field name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: field.pdfField ?? "",
										onChange: (event) => onChange(patchField(fields, index, { pdfField: event.target.value }))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Help shown while filling",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
										value: field.help ?? "",
										onChange: (event) => onChange(patchField(fields, index, { help: event.target.value }))
									})
								})
							]
						})]
					}),
					field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Choices",
						hint: "One choice on each line.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
							value: (field.options ?? []).join("\n"),
							onChange: (event) => onChange(patchField(fields, index, { options: event.target.value.split("\n") }))
						})
					}) : null,
					field.type === "repeat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepeatEditor, {
						items: field.itemFields ?? [],
						onChange: (itemFields) => onChange(patchField(fields, index, { itemFields }))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "quiet",
						onClick: () => onChange(fields.filter((_, position) => position !== index)),
						children: "Remove field"
					})
				]
			}, field.key || index)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				onClick: add,
				children: "Add a field"
			})
		]
	});
}
function RepeatEditor({ items, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 rounded-md border border-line bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "Each row asks for"
			}),
			items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-[1fr_10rem_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						"aria-label": "Row field label",
						value: item.label,
						onChange: (event) => onChange(items.map((row, position) => position === index ? {
							...row,
							label: event.target.value
						} : row))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						"aria-label": "Row field type",
						value: item.type === "repeat" ? "text" : item.type,
						onChange: (event) => onChange(items.map((row, position) => position === index ? {
							...row,
							type: event.target.value
						} : row)),
						children: FIELD_TYPES.filter((type) => type !== "repeat").map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: type,
							children: TYPE_LABEL[type]
						}, type))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "quiet",
						onClick: () => onChange(items.filter((_, position) => position !== index)),
						children: "Remove"
					})
				]
			}, `${item.key}-${index}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "secondary",
				onClick: () => onChange([...items, {
					key: `col_${items.length + 1}`,
					label: "Detail",
					type: "text",
					required: false
				}]),
				children: "Add a row field"
			})
		]
	});
}
function FieldFillForm({ fields, value, errors, onChange }) {
	const set = (key, next) => onChange({
		...value,
		[key]: next
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [fields.map((field) => {
			if (field.type === "repeat") {
				const rows = Array.isArray(value[field.key]) ? value[field.key] : [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-ink-soft",
							children: field.label
						}),
						field.help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: field.help
						}) : null,
						errors[field.key] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: errors[field.key]
						}) : null,
						rows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 rounded-md border border-line bg-paper p-3",
							children: [(field.itemFields ?? []).map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: child.label,
								error: errors[`${field.key}.${index}.${child.key}`],
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
									value: row[child.key] ?? "",
									type: child.type === "number" ? "number" : child.type === "date" ? "date" : "text",
									onChange: (event) => {
										const next = rows.map((item, position) => position === index ? {
											...item,
											[child.key]: event.target.value
										} : item);
										set(field.key, next);
									}
								})
							}, child.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "quiet",
								onClick: () => set(field.key, rows.filter((_, position) => position !== index)),
								children: "Remove row"
							})]
						}, index)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => {
								const blank = {};
								for (const child of field.itemFields ?? []) blank[child.key] = "";
								set(field.key, [...rows, blank]);
							},
							children: ["Add ", field.label.toLowerCase()]
						})
					]
				}, field.key);
			}
			if (field.type === "checkbox") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "size-4 accent-primary",
					checked: value[field.key] === true,
					onChange: (event) => set(field.key, event.target.checked)
				}), field.label]
			}, field.key);
			const text = typeof value[field.key] === "string" ? String(value[field.key]) : "";
			const control = field.type === "textarea" || field.type === "lines" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextArea, {
				value: text,
				onChange: (event) => set(field.key, event.target.value)
			}) : field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: text,
				onChange: (event) => set(field.key, event.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Choose"
				}), (field.options ?? []).filter(Boolean).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: option,
					children: option
				}, option))]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
				type: field.type === "number" ? "number" : field.type === "date" ? "date" : "text",
				value: text,
				onChange: (event) => set(field.key, event.target.value)
			});
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: field.label,
				hint: field.help ?? (field.type === "lines" ? "One item on each line." : void 0),
				error: errors[field.key],
				children: control
			}, field.key);
		}), errors.form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			role: "alert",
			children: errors.form
		}) : null]
	});
}
//#endregion
export { FieldSchemaEditor as n, FieldFillForm as t };
