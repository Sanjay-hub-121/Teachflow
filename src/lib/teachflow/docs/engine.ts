import { createHash } from "node:crypto";
import Docxtemplater from "docxtemplater";
import ExcelJS from "exceljs";
import PizZip from "pizzip";
import { PDFCheckBox, PDFDocument, PDFDropdown, PDFTextField, StandardFonts } from "pdf-lib";
import PptxGenJS from "pptxgenjs";
import { type FieldDef, type FormValue, slugKey } from "../fields.ts";
import { AppError } from "../errors.ts";

// Uploads are sent as base64 in a server-function request. Keeping the raw
// file below 3 MB leaves room for base64 expansion and request metadata under
// Vercel Hobby's function body limit.
export const MAX_UPLOAD_BYTES = 3_000_000;
const MAX_UNZIP_BYTES = 20_000_000;

export type OfficeFormat = "docx" | "xlsx" | "pptx" | "pdf";

export type Analysis = {
  format: OfficeFormat;
  textPreview: string;
  suggested: FieldDef[];
  notes: string[];
};

export type FillResult = {
  bytes: Uint8Array;
  notes: string[];
};

export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function decodeBase64(value: string): Uint8Array {
  const cleaned = value.replace(/^data:[^,]*,/, "").trim();
  return new Uint8Array(Buffer.from(cleaned, "base64"));
}

export function encodeBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

export function detectFormat(filename: string, bytes: Uint8Array): OfficeFormat | null {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  if (!["docx", "xlsx", "pptx", "pdf"].includes(ext)) return null;
  if (ext === "pdf") {
    const header = Buffer.from(bytes.subarray(0, 5)).toString("utf8");
    return header.startsWith("%PDF") ? "pdf" : null;
  }
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) return null;
  try {
    const zip = new PizZip(Buffer.from(bytes));
    if (ext === "docx" && zip.file("word/document.xml")) return "docx";
    if (ext === "xlsx" && zip.file("xl/workbook.xml")) return "xlsx";
    if (ext === "pptx" && zip.file("ppt/presentation.xml")) return "pptx";
  } catch {
    return null;
  }
  return null;
}

function assertZipSize(zip: PizZip) {
  let total = 0;
  for (const file of Object.values(zip.files)) {
    if (file.dir) continue;
    total += file.asUint8Array().length;
    if (total > MAX_UNZIP_BYTES) {
      throw new Error("This file is too large to process safely.");
    }
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

export function xmlToText(xml: string): string {
  return xml
    .replace(/<w:p[ >]/g, "\n")
    .replace(/<a:p[ >]/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\u0026amp;/g, "&")
    .replace(/\u0026lt;/g, "<")
    .replace(/\u0026gt;/g, ">")
    .replace(/\u0026quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function suggestFromTokens(text: string): FieldDef[] {
  const tokenRe = /\{\{\s*([#/]?)([A-Za-z][A-Za-z0-9_]*)\s*\}\}/g;
  const fields: FieldDef[] = [];
  const used = new Set<string>();
  let loop: { key: string; field: FieldDef } | null = null;
  for (const match of text.matchAll(tokenRe)) {
    const marker = match[1] ?? "";
    const name = match[2].toLowerCase();
    if (marker === "#") {
      const field: FieldDef = {
        key: used.has(name) ? slugKey(name, used) : name,
        label: labelFromKey(name),
        type: "repeat",
        required: false,
        token: name,
        itemFields: [],
      };
      used.add(field.key);
      fields.push(field);
      loop = { key: name, field };
      continue;
    }
    if (marker === "/") {
      if (loop?.key === name) loop = null;
      continue;
    }
    const target = loop?.field.itemFields ?? fields;
    const localUsed = loop ? new Set((loop.field.itemFields ?? []).map((item) => item.key)) : used;
    if ([...target].some((item) => item.token === name || item.key === name)) continue;
    const key = localUsed.has(name) ? slugKey(name, localUsed) : name;
    localUsed.add(key);
    if (!loop) used.add(key);
    target.push({
      key,
      label: labelFromKey(name),
      type: name.includes("date") ? "date" : name.includes("mark") || name === "duration" ? "text" : "text",
      required: !loop,
      token: name,
    });
  }
  return fields;
}

function labelFromKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function suggestLooseLabels(text: string, existing: FieldDef[]): FieldDef[] {
  const used = new Set(existing.map((field) => field.key));
  const extra: FieldDef[] = [];
  for (const line of text.split("\n")) {
    const match = /^([A-Za-z][A-Za-z0-9 /()-]{1,40}):\s*$/.exec(line.trim());
    if (!match) continue;
    const label = match[1].trim();
    if (existing.concat(extra).some((field) => field.label.toLowerCase() === label.toLowerCase())) continue;
    const key = slugKey(label, used);
    extra.push({
      key,
      label,
      type: /date/i.test(label) ? "date" : "text",
      required: false,
      help: `No placeholder was found. Add {{${key}}} or set an exact phrase to replace.`,
    });
    if (extra.length >= 8) break;
  }
  return extra;
}

function templateData(fields: FieldDef[], value: Record<string, FormValue>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = value[field.key];
    if (field.type === "checkbox") data[field.key] = raw === true ? "Yes" : "No";
    else if (field.type === "repeat") data[field.key] = Array.isArray(raw) ? raw : [];
    else data[field.key] = raw == null ? "" : String(raw);
  }
  return data;
}

function templaterError(error: unknown): string {
  if (error && typeof error === "object" && "properties" in error) {
    const properties = (error as { properties?: { errors?: { properties?: { explanation?: string } }[] } }).properties;
    const explanation = properties?.errors?.[0]?.properties?.explanation;
    if (explanation) return explanation;
  }
  return error instanceof Error ? error.message : "The document could not be filled.";
}

function renderZip(bytes: Uint8Array, data: Record<string, unknown>): { bytes: Uint8Array } {
  const zip = new PizZip(Buffer.from(bytes));
  assertZipSize(zip);
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
    paragraphLoop: true,
    linebreaks: true,
    nullGetter() {
      return "";
    },
  });
  doc.render(data);
  const out = doc.getZip().generate({ type: "uint8array" }) as Uint8Array;
  return { bytes: out };
}

export function replaceUniqueAnchors(xml: string, pairs: { anchor: string; value: string }[]): { xml: string; notes: string[] } {
  let next = xml;
  const notes: string[] = [];
  for (const pair of pairs) {
    const anchor = pair.anchor.trim();
    if (!anchor) continue;
    const needle = escapeXml(anchor);
    const replacement = escapeXml(pair.value);
    let count = 0;
    const probe = next.replace(/>([^<]*)</g, (full, text: string) => {
      if (!text.includes(needle)) return full;
      count += text.split(needle).length - 1;
      return full;
    });
    void probe;
    if (count === 0) {
      notes.push(`“${anchor}” was not found as a single phrase, so it was left unchanged.`);
      continue;
    }
    if (count > 1) {
      notes.push(`“${anchor}” appears ${count} times, so it was not replaced.`);
      continue;
    }
    let replaced = false;
    next = next.replace(/>([^<]*)</g, (full, text: string) => {
      if (replaced || !text.includes(needle)) return full;
      replaced = true;
      return `>${text.replace(needle, replacement)}<`;
    });
  }
  return { xml: next, notes };
}

function applyAnchors(bytes: Uint8Array, format: OfficeFormat, fields: FieldDef[], value: Record<string, FormValue>): { bytes: Uint8Array; notes: string[] } {
  const pairs = fields
    .filter((field) => field.anchor && field.type !== "repeat")
    .map((field) => ({ anchor: field.anchor ?? "", value: String(value[field.key] ?? "") }));
  if (pairs.length === 0) return { bytes, notes: [] };
  const zip = new PizZip(Buffer.from(bytes));
  const notes: string[] = [];
  const paths = Object.keys(zip.files).filter((path) => {
    if (format === "docx") return /^word\/(document|header\d+|footer\d+)\.xml$/.test(path);
    if (format === "pptx") return /^ppt\/slides\/slide\d+\.xml$/.test(path);
    return false;
  });
  for (const path of paths) {
    const file = zip.file(path);
    if (!file) continue;
    const updated = replaceUniqueAnchors(file.asText(), pairs);
    notes.push(...updated.notes);
    zip.file(path, updated.xml);
  }
  return { bytes: zip.generate({ type: "uint8array" }) as Uint8Array, notes };
}

async function fillSpreadsheet(
  bytes: Uint8Array,
  fields: FieldDef[],
  value: Record<string, FormValue>,
): Promise<FillResult> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(Buffer.from(bytes) as unknown as ExcelJS.Buffer);
  const notes: string[] = [];
  const data = templateData(fields, value);

  const writeCell = (sheetName: string, address: string, next: string, label: string) => {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      notes.push(`Worksheet “${sheetName}” was not found for ${label}.`);
      return;
    }
    const cell = sheet.getCell(address);
    if (cell.formula) {
      notes.push(`${sheetName}!${address} contains a formula, so it was left unchanged.`);
      return;
    }
    cell.value = next;
  };

  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (cell.formula || typeof cell.value !== "string" || !cell.value.includes("{{")) return;
        let text = cell.value;
        for (const [key, replacement] of Object.entries(data)) {
          if (typeof replacement === "string") {
            text = text.split(`{{${key}}}`).join(replacement);
          }
        }
        if (text !== cell.value) cell.value = text;
      });
    });
  });

  for (const field of fields) {
    if (field.type === "lines" && field.sheet && field.cell) {
      const lines = String(value[field.key] ?? "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const match = /^([A-Z]+)(\d+)$/.exec(field.cell.toUpperCase());
      if (!match) {
        notes.push(`“${field.label}” does not have a valid starting cell.`);
        continue;
      }
      const column = match[1];
      let row = Number(match[2]);
      if (lines.length === 0 && field.required) notes.push(`${field.label} had no lines to write.`);
      for (const line of lines.slice(0, 80)) {
        writeCell(field.sheet, `${column}${row}`, line, field.label);
        row += 1;
      }
      continue;
    }
    if (field.sheet && field.cell && field.type !== "repeat") {
      writeCell(field.sheet, field.cell, String(data[field.key] ?? ""), field.label);
    }
  }

  const out = await workbook.xlsx.writeBuffer();
  return { bytes: new Uint8Array(out), notes };
}

async function fillPdf(bytes: Uint8Array, fields: FieldDef[], value: Record<string, FormValue>): Promise<FillResult> {
  const pdf = await PDFDocument.load(bytes);
  const form = pdf.getForm();
  const existing = form.getFields();
  if (existing.length === 0) {
    return buildAnswerPdf(fields, value, [
      "The original PDF has no fillable fields, so TeachFlow created a new PDF with your answers.",
      "Scanned pages were not edited.",
    ]);
  }
  const notes: string[] = [];
  for (const field of fields) {
    const name = field.pdfField || field.token || field.key;
    const match = existing.find((item) => item.getName() === name);
    if (!match) {
      notes.push(`PDF field “${name}” was not found.`);
      continue;
    }
    const raw = value[field.key];
    if (match instanceof PDFCheckBox) {
      if (raw === true) match.check();
      else match.uncheck();
    } else if (match instanceof PDFDropdown) {
      const text = String(raw ?? "");
      if (text) {
        try {
          match.select(text);
        } catch {
          notes.push(`“${text}” is not an option for ${field.label}.`);
        }
      }
    } else if (match instanceof PDFTextField) {
      match.setText(String(raw ?? ""));
    } else {
      notes.push(`${field.label} uses a PDF control TeachFlow does not change.`);
    }
  }
  const saved = await pdf.save();
  return { bytes: new Uint8Array(saved), notes };
}

async function buildAnswerPdf(fields: FieldDef[], value: Record<string, FormValue>, preamble: string[]): Promise<FillResult> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595.28, 841.89]);
  let y = 800;
  const draw = (text: string, size: number, face: typeof font) => {
    const words = text.split(/\s+/);
    let line = "";
    const flush = () => {
      if (y < 56) {
        page = pdf.addPage([595.28, 841.89]);
        y = 800;
      }
      page.drawText(line, { x: 48, y, size, font: face });
      y -= size + 6;
      line = "";
    };
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (face.widthOfTextAtSize(next, size) > 500) flush();
      line = line ? `${line} ${word}` : word;
    }
    if (line) flush();
  };
  for (const line of preamble) draw(line, 11, font);
  y -= 8;
  for (const field of fields) {
    draw(field.label, 12, bold);
    const raw = value[field.key];
    if (Array.isArray(raw)) {
      raw.forEach((row, index) => {
        const text = Object.entries(row)
          .map(([key, item]) => `${key}: ${item}`)
          .join("  ");
        draw(`${index + 1}. ${text || "—"}`, 11, font);
      });
      if (raw.length === 0) draw("—", 11, font);
    } else if (typeof raw === "boolean") {
      draw(raw ? "Yes" : "No", 11, font);
    } else {
      const text = String(raw ?? "").trim();
      for (const part of (text || "—").split("\n")) draw(part || " ", 11, font);
    }
    y -= 6;
  }
  const saved = await pdf.save();
  return { bytes: new Uint8Array(saved), notes: preamble };
}

export async function analyzeFile(filename: string, bytes: Uint8Array): Promise<Analysis> {
  if (bytes.length === 0) throw new Error("The file is empty.");
  if (bytes.length > MAX_UPLOAD_BYTES) throw new AppError("Files must be 3 MB or smaller.");
  const format = detectFormat(filename, bytes);
  if (!format) throw new Error("Upload a DOCX, XLSX, PPTX, or PDF file. The file contents must match the extension.");
  const notes: string[] = [];
  if (format === "pdf") {
    try {
      const pdf = await PDFDocument.load(bytes);
      const formFields = pdf.getForm().getFields();
      const suggested: FieldDef[] = formFields.slice(0, 40).map((field) => {
        const name = field.getName();
        const type = field instanceof PDFCheckBox ? "checkbox" : field instanceof PDFDropdown ? "select" : "text";
        const options = field instanceof PDFDropdown ? field.getOptions().slice(0, 20) : undefined;
        return {
          key: slugKey(name, new Set<string>()),
          label: labelFromKey(name),
          type,
          required: false,
          pdfField: name,
          ...(options ? { options } : {}),
        } satisfies FieldDef;
      });
      const used = new Set<string>();
      for (const field of suggested) {
        field.key = slugKey(field.label, used);
      }
      if (suggested.length === 0) {
        notes.push("This PDF has no fillable fields. You can still define fields, and TeachFlow will create a new PDF of your answers. Scanned pages will not be edited.");
      }
      return { format, textPreview: suggested.map((field) => field.pdfField).join("\n"), suggested, notes };
    } catch {
      throw new Error("This PDF could not be read. It may be encrypted or damaged.");
    }
  }
  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(Buffer.from(bytes) as unknown as ExcelJS.Buffer);
    } catch {
      throw new AppError("This Excel workbook could not be read. Open it in Excel and save it again as .xlsx, then retry.");
    }
    const lines: string[] = [];
    const suggested: FieldDef[] = [];
    const used = new Set<string>();
    workbook.eachSheet((sheet) => {
      lines.push(`# ${sheet.name}`);
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 40) return;
        row.eachCell((cell) => {
          if (typeof cell.value !== "string") return;
          lines.push(`${cell.address}: ${cell.value}`);
          for (const match of cell.value.matchAll(/\{\{\s*([A-Za-z][A-Za-z0-9_]*)\s*\}\}/g)) {
            const token = match[1].toLowerCase();
            if (suggested.some((field) => field.token === token)) continue;
            suggested.push({
              key: slugKey(token, used),
              label: labelFromKey(token),
              type: token.includes("date") ? "date" : "text",
              required: false,
              token,
              sheet: sheet.name,
              cell: cell.address,
            });
          }
        });
      });
    });
    if (suggested.length === 0) {
      notes.push("No {{placeholders}} were found. You can map a field to a cell such as B2. Formulas are never overwritten.");
    }
    return { format, textPreview: lines.join("\n").slice(0, 4000), suggested, notes };
  }
  const zip = new PizZip(Buffer.from(bytes));
  assertZipSize(zip);
  const paths =
    format === "docx"
      ? ["word/document.xml"]
      : Object.keys(zip.files).filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path));
  const text = paths
    .map((path) => xmlToText(zip.file(path)?.asText() ?? ""))
    .filter(Boolean)
    .join("\n\n");
  const suggested = suggestFromTokens(text);
  const loose = suggestLooseLabels(text, suggested);
  if (suggested.length === 0) {
    notes.push(
      format === "docx"
        ? "No {{placeholders}} were found. You can mark a unique phrase to replace, or add placeholders to the Word file."
        : "No {{placeholders}} were found on the slides. Theme and layout are left unchanged.",
    );
  }
  return { format, textPreview: text.slice(0, 4000), suggested: [...suggested, ...loose], notes };
}

export async function fillFile(
  format: OfficeFormat,
  bytes: Uint8Array,
  fields: FieldDef[],
  value: Record<string, FormValue>,
): Promise<FillResult> {
  const original = bytes.slice();
  if (format === "xlsx") return fillSpreadsheet(original, fields, value);
  if (format === "pdf") return fillPdf(original, fields, value);
  const data = templateData(fields, value);
  const text = Buffer.from(original).toString("utf8");
  const hasTokens = original.includes(0x7b) && text.includes("{{");
  let current: Uint8Array = original;
  const notes: string[] = [];
  if (hasTokens) {
    try {
      current = renderZip(current, data).bytes;
    } catch (error) {
      throw new Error(templaterError(error));
    }
    for (const field of fields) {
      if (field.token && !text.includes(`{{${field.token}}}`) && !text.includes(`{{#${field.token}}}`)) {
        notes.push(`Placeholder {{${field.token}}} was not in the original file.`);
      }
    }
  }
  const anchored = applyAnchors(current, format, fields, value);
  notes.push(...anchored.notes);
  return { bytes: anchored.bytes, notes };
}

function docxFromParagraphs(paragraphs: string[]): Uint8Array {
  const body = paragraphs
    .map((paragraph) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(paragraph)}</w:t></w:r></w:p>`)
    .join("");
  const zip = new PizZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  zip.file(
    "word/_rels/document.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`,
  );
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body>
</w:document>`,
  );
  return zip.generate({ type: "uint8array" }) as Uint8Array;
}

export type StarterKind = "question-paper" | "lesson-plan" | "worksheet" | "meeting" | "report";

export async function buildStarter(kind: StarterKind): Promise<{
  filename: string;
  format: OfficeFormat;
  bytes: Uint8Array;
  name: string;
  description: string;
  category: string;
  fields: FieldDef[];
}> {
  if (kind === "question-paper") {
    const fields: FieldDef[] = [
      { key: "institution", label: "Institution", type: "text", required: true, token: "institution" },
      { key: "exam_name", label: "Examination", type: "text", required: true, token: "exam_name" },
      { key: "subject", label: "Subject", type: "text", required: true, token: "subject" },
      { key: "grade", label: "Class", type: "text", required: true, token: "grade" },
      { key: "exam_date", label: "Date", type: "date", required: false, token: "exam_date" },
      { key: "duration", label: "Duration", type: "text", required: false, token: "duration" },
      { key: "max_marks", label: "Maximum marks", type: "number", required: false, token: "max_marks" },
      { key: "instructions", label: "Instructions", type: "textarea", required: false, token: "instructions" },
      {
        key: "questions",
        label: "Questions",
        type: "repeat",
        required: true,
        token: "questions",
        itemFields: [
          { key: "number", label: "Number", type: "text", required: true, token: "number" },
          { key: "prompt", label: "Question", type: "textarea", required: true, token: "prompt" },
          { key: "marks", label: "Marks", type: "number", required: true, token: "marks" },
        ],
      },
    ];
    return {
      filename: "question-paper.docx",
      format: "docx",
      name: "Question paper",
      description: "A reusable paper with institution, exam details, and a question list.",
      category: "paper",
      fields,
      bytes: docxFromParagraphs([
        "{{institution}}",
        "{{exam_name}}",
        "Subject: {{subject}}    Class: {{grade}}",
        "Date: {{exam_date}}    Duration: {{duration}}    Maximum marks: {{max_marks}}",
        "Instructions",
        "{{instructions}}",
        "Questions",
        "{{#questions}}",
        "{{number}}. {{prompt}} ({{marks}} marks)",
        "{{/questions}}",
        "— End of paper —",
      ]),
    };
  }
  if (kind === "lesson-plan") {
    const fields: FieldDef[] = [
      ["subject", "Subject"],
      ["grade", "Class"],
      ["topic", "Topic"],
      ["duration", "Duration"],
      ["objectives", "Learning objectives"],
      ["resources", "Teaching resources"],
      ["activities", "Activities"],
      ["assessment", "Assessment"],
      ["homework", "Homework"],
    ].map(([key, label]) => ({
      key,
      label,
      type: ["objectives", "resources", "activities", "assessment", "homework"].includes(key) ? "textarea" : "text",
      required: ["subject", "topic"].includes(key),
      token: key,
    })) as FieldDef[];
    return {
      filename: "lesson-plan.docx",
      format: "docx",
      name: "Lesson plan",
      description: "A simple lesson plan you can fill in for each class.",
      category: "lesson",
      fields,
      bytes: docxFromParagraphs([
        "Lesson plan",
        "Subject: {{subject}}    Class: {{grade}}",
        "Topic: {{topic}}",
        "Duration: {{duration}}",
        "Learning objectives",
        "{{objectives}}",
        "Resources",
        "{{resources}}",
        "Activities",
        "{{activities}}",
        "Assessment",
        "{{assessment}}",
        "Homework",
        "{{homework}}",
      ]),
    };
  }
  if (kind === "worksheet") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Worksheet");
    sheet.getColumn(1).width = 22;
    sheet.getColumn(2).width = 56;
    sheet.getCell("A1").value = "Title";
    sheet.getCell("A1").font = { bold: true };
    sheet.getCell("B1").value = "{{title}}";
    sheet.getCell("A2").value = "Subject";
    sheet.getCell("B2").value = "{{subject}}";
    sheet.getCell("A3").value = "Class";
    sheet.getCell("B3").value = "{{grade}}";
    sheet.getCell("A4").value = "Date";
    sheet.getCell("B4").value = "{{date}}";
    sheet.getCell("A6").value = "Questions";
    sheet.getCell("A6").font = { bold: true };
    sheet.getCell("A7").value = "{{questions}}";
    const out = await workbook.xlsx.writeBuffer();
    return {
      filename: "worksheet.xlsx",
      format: "xlsx",
      name: "Worksheet",
      description: "A spreadsheet worksheet. Labels in column A stay put.",
      category: "worksheet",
      bytes: new Uint8Array(out),
      fields: [
        { key: "title", label: "Title", type: "text", required: true, token: "title", sheet: "Worksheet", cell: "B1" },
        { key: "subject", label: "Subject", type: "text", required: true, token: "subject", sheet: "Worksheet", cell: "B2" },
        { key: "grade", label: "Class", type: "text", required: false, token: "grade", sheet: "Worksheet", cell: "B3" },
        { key: "date", label: "Date", type: "date", required: false, token: "date", sheet: "Worksheet", cell: "B4" },
        { key: "questions", label: "Questions", type: "lines", required: true, token: "questions", sheet: "Worksheet", cell: "A7", help: "One question on each line." },
      ],
    };
  }
  if (kind === "meeting") {
    const pptx = new PptxGenJS();
    pptx.title = "Meeting";
    const slide = pptx.addSlide();
    slide.addText("{{title}}", { x: 0.5, y: 0.4, w: 9, h: 0.8, fontSize: 28, fontFace: "Calibri" });
    slide.addText("{{date}}", { x: 0.5, y: 1.3, w: 9, h: 0.4, fontSize: 16, fontFace: "Calibri" });
    slide.addText("{{agenda}}", { x: 0.5, y: 2.0, w: 9, h: 3.5, fontSize: 18, fontFace: "Calibri" });
    const out = (await pptx.write({ outputType: "uint8array" })) as Uint8Array;
    return {
      filename: "meeting.pptx",
      format: "pptx",
      name: "Meeting agenda",
      description: "A one-slide agenda. Other slides you add later are left alone when you reuse it.",
      category: "meeting",
      bytes: out,
      fields: [
        { key: "title", label: "Title", type: "text", required: true, token: "title" },
        { key: "date", label: "Date", type: "date", required: false, token: "date" },
        { key: "agenda", label: "Agenda", type: "textarea", required: true, token: "agenda" },
      ],
    };
  }
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawText("Academic report", { x: 48, y: 790, size: 20, font });
  const form = pdf.getForm();
  const title = form.createTextField("title");
  title.addToPage(page, { x: 48, y: 730, width: 500, height: 22 });
  page.drawText("Title", { x: 48, y: 756, size: 11, font });
  const period = form.createTextField("period");
  period.addToPage(page, { x: 48, y: 680, width: 240, height: 22 });
  page.drawText("Period", { x: 48, y: 706, size: 11, font });
  const summary = form.createTextField("summary");
  summary.enableMultiline();
  summary.addToPage(page, { x: 48, y: 460, width: 500, height: 180 });
  page.drawText("Summary", { x: 48, y: 648, size: 11, font });
  const saved = await pdf.save();
  return {
    filename: "report.pdf",
    format: "pdf",
    name: "Academic report",
    description: "A fillable PDF report. TeachFlow fills the form fields and keeps the page.",
    category: "report",
    bytes: new Uint8Array(saved),
    fields: [
      { key: "title", label: "Title", type: "text", required: true, pdfField: "title" },
      { key: "period", label: "Period", type: "text", required: false, pdfField: "period" },
      { key: "summary", label: "Summary", type: "textarea", required: true, pdfField: "summary" },
    ],
  };
}

export function safeDownloadName(name: string, format: OfficeFormat): string {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "document";
  return cleaned.toLowerCase().endsWith(`.${format}`) ? cleaned : `${cleaned}.${format}`;
}

export function mimeFor(format: OfficeFormat): string {
  if (format === "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (format === "xlsx") return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (format === "pptx") return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  return "application/pdf";
}
