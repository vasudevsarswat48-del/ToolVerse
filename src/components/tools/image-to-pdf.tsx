
import React, { useCallback, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, formatBytes } from "@/lib/pdf-utils";
import { X, GripVertical, Download } from "lucide-react";

type PageSize = "fit" | "a4" | "letter";
type Quality = "high" | "medium" | "low";

const PAGE: Record<Exclude<PageSize, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [quality, setQuality] = useState<Quality>("high");
  const [margin, setMargin] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const addFiles = useCallback((incoming: File[]) => {
    setError("");
    const imgs = incoming.filter((f) =>
      /image\/(jpeg|png|webp|gif|bmp)/i.test(f.type)
    );
    if (!imgs.length) {
      setError("Please select JPG, PNG, WebP, GIF or BMP images.");
      return;
    }
    setFiles((prev) => [...prev, ...imgs]);
    imgs.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPreviews((p) => [...p, url]);
    });
  }, []);

  const removeAt = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const nf = [...files];
    const np = [...previews];
    const [f] = nf.splice(from, 1);
    const [p] = np.splice(from, 1);
    nf.splice(to, 0, f);
    np.splice(to, 0, p);
    setFiles(nf);
    setPreviews(np);
  };

  const convert = async () => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      const pdf = await PDFDocument.create();
      const scale =
        quality === "high" ? 1 : quality === "medium" ? 0.75 : 0.5;

      for (const file of files) {
        let bytes = await file.arrayBuffer();
        // WebP/GIF → canvas → PNG for embed
        let embedType: "png" | "jpg" = file.type.includes("png")
          ? "png"
          : "jpg";
        if (
          file.type.includes("webp") ||
          file.type.includes("gif") ||
          file.type.includes("bmp")
        ) {
          const blob = await rasterize(file, scale);
          bytes = await blob.arrayBuffer();
          embedType = "png";
        } else if (scale < 1) {
          const blob = await rasterize(file, scale);
          bytes = await blob.arrayBuffer();
          embedType = "png";
        }

        const image =
          embedType === "png"
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);

        let pageW: number, pageH: number;
        if (pageSize === "fit") {
          pageW = image.width + margin * 2;
          pageH = image.height + margin * 2;
        } else {
          [pageW, pageH] = PAGE[pageSize];
        }
        const page = pdf.addPage([pageW, pageH]);
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const r = Math.min(maxW / image.width, maxH / image.height, 1);
        const w = image.width * r;
        const h = image.height * r;
        page.drawImage(image, {
          x: (pageW - w) / 2,
          y: (pageH - h) / 2,
          width: w,
          height: h,
        });
      }

      const out = await pdf.save({ useObjectStreams: true });
      await downloadPdf(out, "images-to-pdf.pdf");
    } catch (e) {
      console.error(e);
      setError("Conversion failed. Try different images or lower quality.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        multiple
        onFiles={addFiles}
        label="Drop images here or click to browse"
        hint="JPG, PNG, WebP, GIF, BMP — multiple files supported"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 m-0">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="relative rounded-xl border border-theme bg-surface overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-surface-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previews[i]}
                    alt={f.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-2 flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    title="Move left"
                    onClick={() => move(i, i - 1)}
                    className="p-1 rounded border border-theme bg-surface text-muted cursor-pointer"
                  >
                    <GripVertical size={14} />
                  </button>
                  <span className="flex-1 truncate text-muted" title={f.name}>
                    {i + 1}. {f.name} · {formatBytes(f.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer border-0 bg-transparent"
                    aria-label="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="text-muted">Page size</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="mt-1 w-full rounded-lg border border-theme bg-surface text-main px-3 py-2"
              >
                <option value="fit">Fit to image</option>
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted">Image quality</span>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as Quality)}
                className="mt-1 w-full rounded-lg border border-theme bg-surface text-main px-3 py-2"
              >
                <option value="high">High (larger file)</option>
                <option value="medium">Medium</option>
                <option value="low">Low (smaller file)</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted">Margin (pt): {margin}</span>
              <input
                type="range"
                min={0}
                max={48}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
          </div>

          <ActionButton onClick={convert} loading={busy} disabled={!files.length}>
            <Download size={16} /> Convert to PDF ({files.length}{" "}
            {files.length === 1 ? "page" : "pages"})
          </ActionButton>
        </>
      )}
    </div>
  );
}

async function rasterize(file: File, scale: number): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error("toBlob failed"))),
        "image/png",
        0.92
      )
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
