
import React, { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, formatBytes, getPageCount, loadPdf } from "@/lib/pdf-utils";
import { Download, FileText } from "lucide-react";

export default function RemovePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFiles = async (files: File[]) => {
    setError("");
    setSelected(new Set());
    const f = files[0];
    if (!f) return;
    const n = await getPageCount(f);
    setFile(f);
    setPages(n);
  };

  const toggle = (i: number) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  };

  const run = async () => {
    if (!file || selected.size === 0) return;
    if (selected.size >= pages) {
      setError("You cannot remove every page.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await loadPdf(file);
      const out = await PDFDocument.create();
      const keep = src
        .getPageIndices()
        .filter((i) => !selected.has(i + 1));
      const copied = await out.copyPages(src, keep);
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save({ useObjectStreams: true });
      await downloadPdf(bytes, file.name.replace(/\.pdf$/i, "") + "-edited.pdf");
    } catch (e) {
      console.error(e);
      setError("Could not remove pages.");
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
        hint="Click page numbers to mark them for removal"
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

          <div>
            <p className="text-sm text-muted mb-2">
              Select pages to remove ({selected.size} selected)
            </p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
                const on = selected.has(n);
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => toggle(n)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium border cursor-pointer ${
                      on
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-surface border-theme text-main hover:border-[var(--primary)]"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          <ActionButton onClick={run} loading={busy} disabled={selected.size === 0}>
            <Download size={16} /> Remove {selected.size || ""} page
            {selected.size !== 1 ? "s" : ""} & download
          </ActionButton>
        </>
      )}
    </div>
  );
}
