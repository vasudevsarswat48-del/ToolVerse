
import React, { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { degrees, downloadPdf, formatBytes, getPageCount, loadPdf } from "@/lib/pdf-utils";
import { Download, FileText, RotateCw } from "lucide-react";

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [scope, setScope] = useState<"all" | "range">("all");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = async (files: File[]) => {
    setError("");
    const f = files[0];
    if (!f) return;
    const n = await getPageCount(f);
    setFile(f);
    setPages(n);
    setEnd(n);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const doc = await loadPdf(file);
      const count = doc.getPageCount();
      const from = scope === "all" ? 0 : Math.max(0, start - 1);
      const to = scope === "all" ? count : Math.min(count, end);
      for (let i = from; i < to; i++) {
        const page = doc.getPage(i);
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      }
      const bytes = await doc.save({ useObjectStreams: true });
      await downloadPdf(bytes, file.name.replace(/\.pdf$/i, "") + `-rotated-${angle}.pdf`);
    } catch (e) {
      console.error(e);
      setError("Rotate failed.");
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
        hint="Rotate all pages or a selected range"
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
            {([90, 180, 270] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAngle(a)}
                className={`px-4 py-2 rounded-lg text-sm border cursor-pointer flex items-center gap-1.5 ${
                  angle === a
                    ? "bg-primary text-[var(--on-primary)] border-transparent"
                    : "bg-surface border-theme text-main"
                }`}
              >
                <RotateCw size={14} /> {a}°
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setScope("all")}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                scope === "all"
                  ? "bg-primary text-[var(--on-primary)] border-transparent"
                  : "bg-surface border-theme text-main"
              }`}
            >
              All pages
            </button>
            <button
              type="button"
              onClick={() => setScope("range")}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                scope === "range"
                  ? "bg-primary text-[var(--on-primary)] border-transparent"
                  : "bg-surface border-theme text-main"
              }`}
            >
              Page range
            </button>
          </div>

          {scope === "range" && (
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="text-muted">Start</span>
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
                <span className="text-muted">End</span>
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
            <Download size={16} /> Rotate {angle}° & download
          </ActionButton>
        </>
      )}
    </div>
  );
}
