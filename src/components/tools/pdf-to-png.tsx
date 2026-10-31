import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { formatBytes } from "@/lib/pdf-utils";

export default function PdfToPng() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; page: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const convert = async () => {
    if (!file) return;
    setBusy(true); setError(""); setPages([]);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const out: { url: string; page: number }[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas } as any).promise;
        out.push({ page: i, url: canvas.toDataURL("image/png") });
      }
      setPages(out);
    } catch { setError("Could not convert this PDF."); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <DropZone accept="application/pdf,.pdf" onFiles={(f) => { setFile(f[0]||null); setPages([]); }} label="Drop PDF" hint="Each page → PNG" />
      {file && <p className="text-sm text-muted m-0">{file.name} · {formatBytes(file.size)}</p>}
      {error && <p className="text-sm m-0" style={{color:"#dc2626"}}>{error}</p>}
      <ActionButton onClick={convert} disabled={!file} loading={busy}>Convert to PNG</ActionButton>
      <div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))"}}>
        {pages.map(p => (
          <a key={p.page} href={p.url} download={`page-${p.page}.png`} className="preview-box" style={{textDecoration:"none",color:"inherit"}}>
            <img src={p.url} alt="" style={{maxHeight:140,margin:"0 auto"}} />
            <p className="text-xs text-muted m-0" style={{marginTop:6}}>Page {p.page}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
