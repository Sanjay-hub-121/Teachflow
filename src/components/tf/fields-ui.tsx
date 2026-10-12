import { FIELD_TYPES, type FieldDef, type FormValue } from "@/lib/teachflow/fields";
import { Button, Field, Select, TextArea, TextInput } from "./ui";

const TYPE_LABEL: Record<string, string> = {
  text: "Short text",
  textarea: "Long text",
  number: "Number",
  date: "Date",
  select: "Choice",
  checkbox: "Yes or no",
  repeat: "Repeating rows",
  lines: "Lines",
};

function patchField(fields: FieldDef[], index: number, patch: Partial<FieldDef>) {
  return fields.map((field, position) => (position === index ? { ...field, ...patch } : field));
}

export function FieldSchemaEditor({ fields, onChange }: { fields: FieldDef[]; onChange: (fields: FieldDef[]) => void }) {
  const add = () => {
    const used = new Set(fields.map((field) => field.key));
    let n = fields.length + 1;
    let key = `field_${n}`;
    while (used.has(key)) key = `field_${++n}`;
    onChange([...fields, { key, label: "New field", type: "text", required: false }]);
  };

  return (
    <div className="space-y-3">
      {fields.length === 0 ? <p className="text-sm text-muted">No fields yet. Add one, or use the suggestions from the file.</p> : null}
      {fields.map((field, index) => (
        <div key={field.key || index} className="space-y-3 rounded-lg border border-line bg-paper p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label">
              <TextInput value={field.label} onChange={(event) => onChange(patchField(fields, index, { label: event.target.value }))} />
            </Field>
            <Field label="Type">
              <Select
                value={field.type}
                onChange={(event) => {
                  const type = event.target.value as FieldDef["type"];
                  const next: Partial<FieldDef> = { type };
                  if (type === "repeat" && !field.itemFields?.length) {
                    next.itemFields = [{ key: "text", label: "Text", type: "textarea", required: true }];
                  }
                  onChange(patchField(fields, index, next));
                }}
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type} value={type}>{TYPE_LABEL[type]}</option>
                ))}
              </Select>
            </Field>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={field.required}
              onChange={(event) => onChange(patchField(fields, index, { required: event.target.checked }))}
            />
            Required before a document can be generated
          </label>
          <details className="rounded-md border border-line bg-card px-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold">Where this goes in the file</summary>
            <div className="grid gap-3 pb-3 sm:grid-cols-2">
              <Field label="Placeholder" hint="Matches {{name}} in the file. Leave blank if you use a phrase or a cell.">
                <TextInput value={field.token ?? ""} onChange={(event) => onChange(patchField(fields, index, { token: event.target.value }))} />
              </Field>
              <Field label="Exact phrase to replace" hint="Only if the file has no placeholder, and the phrase appears once.">
                <TextInput value={field.anchor ?? ""} onChange={(event) => onChange(patchField(fields, index, { anchor: event.target.value }))} />
              </Field>
              <Field label="Sheet">
                <TextInput value={field.sheet ?? ""} onChange={(event) => onChange(patchField(fields, index, { sheet: event.target.value }))} />
              </Field>
              <Field label="Cell">
                <TextInput value={field.cell ?? ""} onChange={(event) => onChange(patchField(fields, index, { cell: event.target.value }))} />
              </Field>
              <Field label="PDF field name">
                <TextInput value={field.pdfField ?? ""} onChange={(event) => onChange(patchField(fields, index, { pdfField: event.target.value }))} />
              </Field>
              <Field label="Help shown while filling">
                <TextInput value={field.help ?? ""} onChange={(event) => onChange(patchField(fields, index, { help: event.target.value }))} />
              </Field>
            </div>
          </details>
          {field.type === "select" ? (
            <Field label="Choices" hint="One choice on each line.">
              <TextArea
                value={(field.options ?? []).join("\n")}
                onChange={(event) => onChange(patchField(fields, index, { options: event.target.value.split("\n") }))}
              />
            </Field>
          ) : null}
          {field.type === "repeat" ? (
            <RepeatEditor
              items={field.itemFields ?? []}
              onChange={(itemFields) => onChange(patchField(fields, index, { itemFields }))}
            />
          ) : null}
          <Button
            type="button"
            variant="quiet"
            onClick={() => onChange(fields.filter((_, position) => position !== index))}
          >
            Remove field
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add}>Add a field</Button>
    </div>
  );
}

function RepeatEditor({ items, onChange }: { items: FieldDef[]; onChange: (items: FieldDef[]) => void }) {
  return (
    <div className="space-y-2 rounded-md border border-line bg-card p-3">
      <p className="text-sm font-semibold">Each row asks for</p>
      {items.map((item, index) => (
        <div key={`${item.key}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_10rem_auto]">
          <TextInput
            aria-label="Row field label"
            value={item.label}
            onChange={(event) => onChange(items.map((row, position) => (position === index ? { ...row, label: event.target.value } : row)))}
          />
          <Select
            aria-label="Row field type"
            value={item.type === "repeat" ? "text" : item.type}
            onChange={(event) =>
              onChange(items.map((row, position) => (position === index ? { ...row, type: event.target.value as FieldDef["type"] } : row)))
            }
          >
            {FIELD_TYPES.filter((type) => type !== "repeat").map((type) => (
              <option key={type} value={type}>{TYPE_LABEL[type]}</option>
            ))}
          </Select>
          <Button type="button" variant="quiet" onClick={() => onChange(items.filter((_, position) => position !== index))}>
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange([...items, { key: `col_${items.length + 1}`, label: "Detail", type: "text", required: false }])}
      >
        Add a row field
      </Button>
    </div>
  );
}

export function FieldFillForm({
  fields,
  value,
  errors,
  onChange,
}: {
  fields: FieldDef[];
  value: Record<string, FormValue>;
  errors: Record<string, string>;
  onChange: (value: Record<string, FormValue>) => void;
}) {
  const set = (key: string, next: FormValue) => onChange({ ...value, [key]: next });
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        if (field.type === "repeat") {
          const rows = Array.isArray(value[field.key]) ? (value[field.key] as Record<string, string>[]) : [];
          return (
            <div key={field.key} className="space-y-2">
              <p className="text-sm font-semibold text-ink-soft">{field.label}</p>
              {field.help ? <p className="text-sm text-muted">{field.help}</p> : null}
              {errors[field.key] ? <p className="text-sm text-danger">{errors[field.key]}</p> : null}
              {rows.map((row, index) => (
                <div key={index} className="grid gap-2 rounded-md border border-line bg-paper p-3">
                  {(field.itemFields ?? []).map((child) => (
                    <Field key={child.key} label={child.label} error={errors[`${field.key}.${index}.${child.key}`]}>
                      <TextInput
                        value={row[child.key] ?? ""}
                        type={child.type === "number" ? "number" : child.type === "date" ? "date" : "text"}
                        onChange={(event) => {
                          const next = rows.map((item, position) =>
                            position === index ? { ...item, [child.key]: event.target.value } : item,
                          );
                          set(field.key, next);
                        }}
                      />
                    </Field>
                  ))}
                  <Button
                    type="button"
                    variant="quiet"
                    onClick={() => set(field.key, rows.filter((_, position) => position !== index))}
                  >
                    Remove row
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const blank: Record<string, string> = {};
                  for (const child of field.itemFields ?? []) blank[child.key] = "";
                  set(field.key, [...rows, blank]);
                }}
              >
                Add {field.label.toLowerCase()}
              </Button>
            </div>
          );
        }
        if (field.type === "checkbox") {
          return (
            <label key={field.key} className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={value[field.key] === true}
                onChange={(event) => set(field.key, event.target.checked)}
              />
              {field.label}
            </label>
          );
        }
        const text = typeof value[field.key] === "string" ? String(value[field.key]) : "";
        const control =
          field.type === "textarea" || field.type === "lines" ? (
            <TextArea value={text} onChange={(event) => set(field.key, event.target.value)} />
          ) : field.type === "select" ? (
            <Select value={text} onChange={(event) => set(field.key, event.target.value)}>
              <option value="">Choose</option>
              {(field.options ?? []).filter(Boolean).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          ) : (
            <TextInput
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
              value={text}
              onChange={(event) => set(field.key, event.target.value)}
            />
          );
        return (
          <Field key={field.key} label={field.label} hint={field.help ?? (field.type === "lines" ? "One item on each line." : undefined)} error={errors[field.key]}>
            {control}
          </Field>
        );
      })}
      {errors.form ? <p className="text-sm text-danger" role="alert">{errors.form}</p> : null}
    </div>
  );
}
