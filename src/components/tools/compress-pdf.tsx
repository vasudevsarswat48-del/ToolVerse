
import React, { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, formatBytes, getPageCount, loadPdf } from "@/lib/pdf-utils";
import { Download, FileText } from "lucide-react";

type Level = "screen" | "ebook" | "printer";

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [level, setLevel] = useState<Level>("ebook");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);
  const [error, setError] = useState("");

  const onFiles = async (files: File[]) => {
    setError("");
    setResult(null);
    const f = files[0];
    if (!f) return;
    const n = await getPageCount(f);
    setFile(f);
    setPages(n);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      // Client-side: re-save with object streams + strip unused objects.
      // True image recompression needs rasterization; we do structural optimization.
      const doc = await loadPdf(file);
      const bytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });
      // Extra pass: rebuild by copying pages (often smaller)
      const { PDFDocument } = await import("pdf-lib");
      const rebuilt = await PDFDocument.create();
      const copied = await rebuilt.copyPages(doc, doc.getPageIndices());
      copied.forEach((p) => rebuilt.addPage(p));
      const out = await rebuilt.save({ useObjectStreams: true });
      const after = out.byteLength;
      setResult({ before: file.size, after });
      await downloadPdf(out, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf");
    } catch (e) {
      console.error(e);
      setError("Compression failed. The PDF may be encrypted.");
    } finally {
      setBusy(false);
    }
  };

  const saved =
    result && result.before > 0
      ? Math.max(0, Math.round((1 - result.after / result.before) * 100))
      : 0;

  return (
    <div className="space-y-5">
      <DropZone
        accept="application/pdf,.pdf"
        onFiles={onFiles}
        label="Drop a PDF here or click to browse"
        hint="Optimizes structure in your browser — no upload"
      />
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 m-0">
          {error}
        </p>
      )}
      {file && (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-theme bg-surface px-4 py-3">
            <FileText className="text-primary" size={22} />
            <div>
              <p className="m-0 font-medium text-main text-sm">{file.name}</p>
              <p className="m-0 text-xs text-muted">
                {pages} pages · {formatBytes(file.size)}
              </p>
            </div>
          </div>

          <label className="block text-sm">
            <span className="text-muted">Target profile</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="mt-1 w-full rounded-lg border border-theme bg-surface text-main px-3 py-2"
            >
              <option value="screen">Screen (smallest structure)</option>
              <option value="ebook">Ebook (balanced)</option>
              <option value="printer">Printer (preserve quality)</option>
            </select>
          </label>
          <p className="text-xs text-muted m-0">
            Compression rewrites the PDF structure. Heavily image-based PDFs may need
            external tools for deeper image downsampling.
          </p>

          {result && (
            <div className="rounded-xl border border-theme bg-surface-2 px-4 py-3 text-sm">
              <p className="m-0 text-main">
                {formatBytes(result.before)} → {formatBytes(result.after)}
                {saved > 0 ? ` (${saved}% smaller)` : " (already optimized)"}
              </p>
            </div>
          )}

          <ActionButton onClick={run} loading={busy}>
            <Download size={16} /> Compress & download
          </ActionButton>
        </>
      )}
    </div>
  );
}
