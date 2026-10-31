import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { formatBytes } from "@/lib/pdf-utils";

type PageOut = { url: string; page: number };

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageOut[]>([]);
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState(2);
  const [error, setError] = useState("");

  const onFiles = (files: File[]) => {
    setPages([]);
    setError("");
    setFile(files[0] || null);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setPages([]);
    try {
      const pdfjs = await import("pdfjs-dist");
      // Vite-friendly worker
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const data = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjs.getDocument({ data }).promise;
      const out: PageOut[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        out.push({
          page: i,
          url: canvas.toDataURL("image/jpeg", 0.92),
        });
      }
      setPages(out);
    } catch (e) {
      console.error(e);
      setError("Could not read this PDF. It may be encrypted or corrupt.");
    } finally {
      setBusy(false);
    }
  };

  const downloadOne = (p: PageOut) => {
    const a = document.createElement("a");
    a.href = p.url;
    a.download = `${file?.name.replace(/\.pdf$/i, "") || "page"}-${p.page}.jpg`;
    a.click();
  };

  const downloadAll = async () => {
    for (const p of pages) {
      downloadOne(p);
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept="application/pdf,.pdf"
        onFiles={onFiles}
        label="Drop a PDF or click to browse"
        hint="Each page becomes a JPG image in your browser"
      />
      {file && (
        <p className="text-sm text-muted m-0">
          {file.name} · {formatBytes(file.size)}
        </p>
      )}
      {error && (
        <p className="text-sm m-0" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}
      <label className="text-sm" style={{ display: "block" }}>
        <span className="text-muted">Quality scale: {scale}x</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.5}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-full mt-2"
        />
      </label>
      <ActionButton onClick={convert} disabled={!file} loading={busy}>
        Convert to JPG
      </ActionButton>
      {pages.length > 0 && (
        <>
          <ActionButton variant="secondary" onClick={downloadAll}>
            Download all ({pages.length})
          </ActionButton>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
            {pages.map((p) => (
              <button
                key={p.page}
                type="button"
                onClick={() => downloadOne(p)}
                className="preview-box"
                style={{ cursor: "pointer", border: "1px solid var(--border)", padding: 8 }}
              >
                <img src={p.url} alt={`Page ${p.page}`} style={{ maxHeight: 160, margin: "0 auto" }} />
                <p className="text-xs text-muted m-0" style={{ marginTop: 6 }}>
                  Page {p.page} — tap to download
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
