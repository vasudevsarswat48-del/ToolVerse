
import React, { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, formatBytes, getPageCount, loadPdf } from "@/lib/pdf-utils";
import { Download, FileText } from "lucide-react";

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [mode, setMode] = useState<"range" | "each">("range");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = async (files: File[]) => {
    setError("");
    const f = files[0];
    if (!f) return;
    const n = await getPageCount(f);
    if (!n) {
      setError("Could not read this PDF.");
      return;
    }
    setFile(f);
    setPages(n);
    setStart(1);
    setEnd(n);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await loadPdf(file);

      if (mode === "each") {
        for (let i = 0; i < src.getPageCount(); i++) {
          const out = await PDFDocument.create();
          const [p] = await out.copyPages(src, [i]);
          out.addPage(p);
          const bytes = await out.save({ useObjectStreams: true });
          await downloadPdf(bytes, `${file.name.replace(/\.pdf$/i, "")}-page-${i + 1}.pdf`);
          await new Promise((r) => setTimeout(r, 150));
        }
      } else {
        const s = Math.max(0, start - 1);
        const e = Math.min(src.getPageCount(), end);
        if (s >= e) throw new Error("Invalid range");
        const out = await PDFDocument.create();
        const indices = Array.from({ length: e - s }, (_, i) => s + i);
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const bytes = await out.save({ useObjectStreams: true });
        await downloadPdf(
          bytes,
          `${file.name.replace(/\.pdf$/i, "")}-p${start}-${end}.pdf`
        );
      }
    } catch (e) {
      console.error(e);
      setError("Split failed. Check the page range or file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept="application/pdf,.pdf"
        onFiles={onFiles}
        label="Drop a PDF here or click to browse"
        hint="Choose a page range or split into single-page files"
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("range")}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                mode === "range"
                  ? "bg-primary text-[var(--on-primary)] border-transparent"
                  : "bg-surface border-theme text-main"
              }`}
            >
              Extract range
            </button>
            <button
              type="button"
              onClick={() => setMode("each")}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                mode === "each"
                  ? "bg-primary text-[var(--on-primary)] border-transparent"
                  : "bg-surface border-theme text-main"
              }`}
            >
              Split every page
            </button>
          </div>

          {mode === "range" && (
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="text-muted">Start page</span>
                <input
                  type="number"
                  min={1}
                  max={pages}
                  value={start}
                  onChange={(e) => setStart(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-theme bg-surface text-main px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="text-muted">End page</span>
                <input
                  type="number"
                  min={1}
                  max={pages}
                  value={end}
                  onChange={(e) => setEnd(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-theme bg-surface text-main px-3 py-2"
                />
              </label>
            </div>
          )}

          <ActionButton onClick={run} loading={busy}>
            <Download size={16} />
            {mode === "each" ? `Download ${pages} files` : `Extract pages ${start}–${end}`}
          </ActionButton>
        </>
      )}
    </div>
  );
}
