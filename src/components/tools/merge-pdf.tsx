
import React, { useCallback, useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, formatBytes, getPageCount, loadPdf } from "@/lib/pdf-utils";
import { X, ChevronUp, ChevronDown, Download, FileText } from "lucide-react";

type Item = { file: File; pages: number };

export default function MergePdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback(async (incoming: File[]) => {
    setError("");
    const pdfs = incoming.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (!pdfs.length) {
      setError("Please select PDF files.");
      return;
    }
    const next: Item[] = [];
    for (const f of pdfs) {
      const pages = await getPageCount(f);
      next.push({ file: f, pages });
    }
    setItems((prev) => [...prev, ...next]);
  }, []);

  const remove = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const n = [...items];
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };

  const merge = async () => {
    if (items.length < 1) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const { file } of items) {
        const doc = await loadPdf(file);
        const pages = await out.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save({ useObjectStreams: true });
      await downloadPdf(bytes, "merged.pdf");
    } catch (e) {
      console.error(e);
      setError("Merge failed. One file may be encrypted or corrupt.");
    } finally {
      setBusy(false);
    }
  };

  const totalPages = items.reduce((s, i) => s + i.pages, 0);

  return (
    <div className="space-y-5">
      <DropZone
        accept="application/pdf,.pdf"
        multiple
        onFiles={addFiles}
        label="Drop PDF files here or click to browse"
        hint="Order in the list is the order in the merged PDF"
      />
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 m-0">
          {error}
        </p>
      )}
      {items.length > 0 && (
        <>
          <ul className="space-y-2 m-0 p-0 list-none">
            {items.map((it, i) => (
              <li
                key={`${it.file.name}-${i}`}
                className="flex items-center gap-2 rounded-xl border border-theme bg-surface px-3 py-2.5"
              >
                <FileText size={18} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="m-0 text-sm font-medium text-main truncate">
                    {i + 1}. {it.file.name}
                  </p>
                  <p className="m-0 text-xs text-muted">
                    {it.pages} page{it.pages !== 1 ? "s" : ""} · {formatBytes(it.file.size)}
                  </p>
                </div>
                <button type="button" onClick={() => move(i, -1)} className="p-1.5 rounded-lg border border-theme bg-surface cursor-pointer" aria-label="Up">
                  <ChevronUp size={16} />
                </button>
                <button type="button" onClick={() => move(i, 1)} className="p-1.5 rounded-lg border border-theme bg-surface cursor-pointer" aria-label="Down">
                  <ChevronDown size={16} />
                </button>
                <button type="button" onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-600 cursor-pointer border-0 bg-transparent" aria-label="Remove">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted m-0">
            {items.length} file{items.length !== 1 ? "s" : ""} · {totalPages} total pages
          </p>
          <ActionButton onClick={merge} loading={busy}>
            <Download size={16} /> Merge into one PDF
          </ActionButton>
        </>
      )}
    </div>
  );
}
