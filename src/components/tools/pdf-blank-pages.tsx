import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { PDFDocument } from "pdf-lib";
import { downloadPdf } from "@/lib/pdf-utils";

export default function PdfBlankPages() {
  const [n, setN] = useState(1);
  const [size, setSize] = useState<"a4"|"letter">("a4");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      const dim = size==="a4" ? [595.28, 841.89] : [612, 792];
      for (let i=0;i<n;i++) doc.addPage(dim as [number,number]);
      await downloadPdf(await doc.save(), `blank-${n}-pages.pdf`);
    } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Pages: {n}</span>
        <input type="range" min={1} max={50} value={n} onChange={e=>setN(+e.target.value)} className="w-full mt-2" /></label>
      <div className="flex gap-2">
        <button type="button" className={`btn ${size==="a4"?"":"secondary"}`} onClick={()=>setSize("a4")}>A4</button>
        <button type="button" className={`btn ${size==="letter"?"":"secondary"}`} onClick={()=>setSize("letter")}>Letter</button>
      </div>
      <ActionButton onClick={run} loading={busy}>Create blank PDF</ActionButton>
    </div>
  );
}
