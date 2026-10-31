import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { downloadPdf } from "@/lib/pdf-utils";

export default function TextToPdf() {
  const [text, setText] = useState("Hello from TulEra.\n\nType your text here.");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      let page = doc.addPage([595, 842]);
      const margin = 50, size = 12, lineH = 16;
      let y = page.getHeight() - margin;
      for (const line of text.split("\n")) {
        const chunks = line.match(/.{1,90}/g) || [""];
        for (const c of chunks) {
          if (y < margin) { page = doc.addPage([595, 842]); y = page.getHeight() - margin; }
          page.drawText(c, { x: margin, y, size, font, color: rgb(0.1,0.1,0.1) });
          y -= lineH;
        }
      }
      await downloadPdf(await doc.save(), "text.pdf");
    } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={12} className="code-output" />
      <ActionButton onClick={run} loading={busy} disabled={!text.trim()}>Download PDF</ActionButton>
    </div>
  );
}
