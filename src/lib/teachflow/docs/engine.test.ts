import assert from "node:assert/strict";
import { describe, it } from "node:test";
import ExcelJS from "exceljs";
import PizZip from "pizzip";
import { buildStarter, fillFile, replaceUniqueAnchors, sha256 } from "./engine.ts";

describe("document filling", () => {
  it("fills a question paper and keeps unrelated text", async () => {
    const starter = await buildStarter("question-paper");
    const before = sha256(starter.bytes);
    const filled = await fillFile(starter.format, starter.bytes, starter.fields, {
      institution: "River School",
      exam_name: "Mid term",
      subject: "Mathematics",
      grade: "8",
      exam_date: "2026-03-12",
      duration: "90 minutes",
      max_marks: "40",
      instructions: "Answer all questions.",
      questions: [{ number: "1", prompt: "Find 12 × 8.", marks: "4" }],
    });
    assert.equal(sha256(starter.bytes), before);
    const xml = new PizZip(Buffer.from(filled.bytes)).file("word/document.xml")?.asText() ?? "";
    assert.match(xml, /Mathematics/);
    assert.match(xml, /Find 12/);
    assert.match(xml, /End of paper/);
    assert.doesNotMatch(xml, /\{\{subject\}\}/);
  });

  it("fills a spreadsheet cell and leaves a formula alone", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Marks");
    sheet.getCell("A1").value = "Name";
    sheet.getCell("B1").value = "{{name}}";
    sheet.getCell("C1").value = { formula: "1+1", result: 2 };
    sheet.getCell("A2").value = "Keep this label";
    const bytes = new Uint8Array(await workbook.xlsx.writeBuffer());
    const filled = await fillFile(
      "xlsx",
      bytes,
      [{ key: "name", label: "Name", type: "text", required: true, token: "name", sheet: "Marks", cell: "B1" }],
      { name: "Anika" },
    );
    const check = new ExcelJS.Workbook();
    await check.xlsx.load(Buffer.from(filled.bytes) as unknown as ExcelJS.Buffer);
    const out = check.getWorksheet("Marks");
    assert.equal(out?.getCell("B1").value, "Anika");
    assert.equal(out?.getCell("A1").value, "Name");
    assert.equal(out?.getCell("A2").value, "Keep this label");
    assert.equal(out?.getCell("C1").formula, "1+1");
  });

  it("does not replace an anchor that appears twice", () => {
    const xml = "<w:t>Class</w:t><w:t>Class</w:t>";
    const result = replaceUniqueAnchors(xml, [{ anchor: "Class", value: "8" }]);
    assert.equal(result.xml, xml);
    assert.equal(result.notes.length, 1);
  });

  it("fills a PDF form without dropping the heading", async () => {
    const starter = await buildStarter("report");
    const filled = await fillFile(starter.format, starter.bytes, starter.fields, {
      title: "October report",
      period: "October",
      summary: "Classes met their plan.",
    });
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(filled.bytes);
    assert.equal(pdf.getForm().getTextField("title").getText(), "October report");
    assert.equal(pdf.getPageCount(), 1);
  });
    it("fills a meeting slide", async () => {
    const starter = await buildStarter("meeting");
    const filled = await fillFile(starter.format, starter.bytes, starter.fields, {
      title: "Department meeting",
      date: "2026-04-02",
      agenda: "Exam duty\nResult review",
    });
    const xml = new PizZip(Buffer.from(filled.bytes)).file("ppt/slides/slide1.xml")?.asText() ?? "";
    assert.match(xml, /Department meeting/);
    assert.match(xml, /Exam duty/);
  });
});
