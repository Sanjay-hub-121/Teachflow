import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeFields, validateFormData } from "./fields.ts";

describe("template fields", () => {
  it("rejects a missing required answer and keeps a valid one", () => {
    const fields = sanitizeFields([
      { key: "subject", label: "Subject", type: "text", required: true },
      { key: "notes", label: "Notes", type: "textarea", required: false },
    ]);
    const invalid = validateFormData(fields, { subject: "  ", notes: "Bring the globe" });
    assert.equal(invalid.ok, false);
    if (!invalid.ok) assert.match(invalid.errors.subject, /Subject/);
    const valid = validateFormData(fields, { subject: "Geography", notes: "Bring the globe" });
    assert.equal(valid.ok, true);
    if (valid.ok) assert.equal(valid.value.notes, "Bring the globe");
  });

  it("requires rows inside a repeated section", () => {
    const fields = sanitizeFields([
      {
        label: "Questions",
        type: "repeat",
        required: true,
        itemFields: [{ label: "Question", type: "text", required: true }],
      },
    ]);
    const missing = validateFormData(fields, { questions: [] });
    assert.equal(missing.ok, false);
    const ok = validateFormData(fields, { questions: [{ question: "Name the capital." }] });
    assert.equal(ok.ok, true);
  });
});
