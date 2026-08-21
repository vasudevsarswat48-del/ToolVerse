"use client";

import React, { useState } from "react";
import { PDFDocument, PDFName, PDFDict, PDFRawStream } from "pdf-lib";
import { Download, FileWarning } from "lucide-react";

type Level = "low" | "medium" | "high";

const LEVEL_QUALITY: Record<Level, number> = {
  low: 0.85,
  medium: 0.65,
  high: 0.4,
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Re-encodes embedded JPEG (DCTDecode) images at a lower quality via canvas.
 * This is what actually shrinks file size — saving with useObjectStreams
 * alone barely helps if the PDF has photos in it.
 */
async function recompressImages(pdfDoc: PDFDocument, quality: number) {
  const seen = new Set<string>();

  for (const page of pdfDoc.getPages()) {
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObjects = resources.lookup(PDFName.of("XObject"));
    if (!(xObjects instanceof PDFDict)) continue;

    for (const [, ref] of xObjects.entries()) {
      const key = ref.toString();
      if (seen.has(key)) continue;
      seen.add(key);

      const obj = pdfDoc.context.lookup(ref);
      if (!(obj instanceof PDFRawStream)) continue;

      const subtype = obj.dict.get(PDFName.of("Subtype"));
      if (!subtype || subtype.toString() !== "/Image") continue;

      const filter = obj.dict.get(PDFName.of("Filter"));
      const filterName = filter ? filter.toString() : "";
      if (!filterName.includes("DCTDecode")) continue; // only handles JPEGs

      try {
        const pdfBytes = await pdfDoc.save();
const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });

        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(bitmap, 0, 0);

        const newBlob: Blob | null = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
        );
        if (newBlob && newBlob.size < bytes.byteLength) {
          const newBytes = new Uint8Array(await newBlob.arrayBuffer());
          obj.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
          obj.dict.set(PDFName.of("Length"), pdfDoc.context.obj(newBytes.length));
          (obj as any).contents = newBytes;
        }
      } catch {
        // skip images that fail to decode (e.g. CMYK JPEGs)
      }
    }
  }
}

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const originalSize = bytes.byteLength;

      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      await recompressImages(pdfDoc, LEVEL_QUALITY[level]);

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });

      setResult({ original: originalSize, compressed: blob.size });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? `Compression failed: ${err.message}`
          : "Compression failed. The file may be encrypted or corrupted."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const savingsPct =
    result && result.original > 0
      ? Math.max(0, Math.round((1 - result.compressed / result.original) * 100))
      : 0;

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setResult(null);
          setError("");
        }}
        className="w-full glass-input p-3 rounded-xl text-sm"
      />

      <div className="grid grid-cols-3 gap-2">
        {(["low", "medium", "high"] as Level[]).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setLevel(lvl)}
            className={`py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              level === lvl
                ? "bg-accent text-white"
                : "glass-input text-gray-700 hover:bg-gray-50"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <button
        onClick={compressPdf}
        disabled={!file || isProcessing}
        className="w-full py-3 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" /> {isProcessing ? "Compressing..." : "Compress PDF"}
      </button>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          <FileWarning className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="text-sm bg-green-50 border border-green-200 rounded-xl p-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Original</span>
            <span className="font-medium">{formatBytes(result.original)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Compressed</span>
            <span className="font-medium">{formatBytes(result.compressed)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Savings</span>
            <span className="font-semibold text-green-700">{savingsPct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
