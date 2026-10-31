import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { formatBytes } from "@/lib/pdf-utils";

export default function PdfExtractText() {
  const [file, setFile] = useState<File|null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!file) return;
    setBusy(true); setText("");
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      let out = "";
      for (let i=1;i<=doc.numPages;i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        out += content.items.map((it: any) => it.str).join(" ") + "\n\n";
      }
      setText(out.trim());
    } catch { setText("Could not extract text (scanned PDFs need OCR)."); }
    finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      <DropZone accept="application/pdf,.pdf" onFiles={f=>setFile(f[0]||null)} label="Drop PDF" hint="Extract selectable text" />
      {file && <p className="text-sm text-muted m-0">{file.name} · {formatBytes(file.size)}</p>}
      <ActionButton onClick={run} disabled={!file} loading={busy}>Extract text</ActionButton>
      {text && <textarea readOnly value={text} rows={14} className="code-output" />}
      {text && <ActionButton variant="secondary" onClick={()=>navigator.clipboard.writeText(text)}>Copy text</ActionButton>}
    </div>
  );
}
