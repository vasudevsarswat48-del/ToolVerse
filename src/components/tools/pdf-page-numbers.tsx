import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, loadPdf, formatBytes } from "@/lib/pdf-utils";
import { rgb, StandardFonts } from "pdf-lib";

export default function PdfPageNumbers() {
  const [file, setFile] = useState<File|null>(null);
  const [busy, setBusy] = useState(false);
  const [pos, setPos] = useState<"bottom"|"top">("bottom");
  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const doc = await loadPdf(file);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + 1} / ${pages.length}`;
        const size = 10;
        const tw = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: (width - tw) / 2,
          y: pos === "bottom" ? 24 : height - 28,
          size, font, color: rgb(0.3, 0.3, 0.3),
        });
      });
      await downloadPdf(await doc.save(), file.name.replace(/\.pdf$/i,"")+"-numbered.pdf");
    } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      <DropZone accept="application/pdf,.pdf" onFiles={f=>setFile(f[0]||null)} label="Drop PDF" hint="Add page numbers to every page" />
      {file && <p className="text-sm text-muted m-0">{file.name} · {formatBytes(file.size)}</p>}
      <div className="flex gap-2">
        <button type="button" className={`btn ${pos==="bottom"?"":"secondary"}`} onClick={()=>setPos("bottom")}>Bottom</button>
        <button type="button" className={`btn ${pos==="top"?"":"secondary"}`} onClick={()=>setPos("top")}>Top</button>
      </div>
      <ActionButton onClick={run} disabled={!file} loading={busy}>Add page numbers</ActionButton>
    </div>
  );
}
