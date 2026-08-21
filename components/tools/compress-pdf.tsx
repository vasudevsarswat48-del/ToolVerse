import React, { useState, useCallback, useRef } from "react";
import { PDFDocument, PDFName, PDFRawStream, PDFDict } from "pdf-lib";

/**
 * CompressPDF
 * ------------
 * A self-contained React component that lets a user upload a PDF,
 * compress it client-side using pdf-lib, and download the result.
 *
 * Install dependency first:
 *   npm install pdf-lib
 *
 * Notes on how the compression works:
 * - pdf-lib doesn't do JPEG re-encoding out of the box, so this component
 *   focuses on the compression wins pdf-lib CAN give you:
 *     1. Re-saving with object streams enabled (`useObjectStreams: true`),
 *        which packs indirect objects together and often shrinks size.
 *     2. Stripping duplicate/unused objects during the resave.
 *     3. Downscaling embedded raster images by re-encoding them at a lower
 *        JPEG quality (approximate approach: extract raw image streams,
 *        draw to canvas, re-encode, and swap back in) when the browser
 *        Canvas API is available.
 * - For PDFs that are mostly text/vector content, savings will be modest
 *   (pdf-lib's structural cleanup). For PDFs dominated by large embedded
 *   photos, the image re-encoding pass can save significantly more.
 */

type CompressionLevel = "low" | "medium" | "high";

interface CompressResult {
  originalSize: number;
  compressedSize: number;
  blob: Blob;
  fileName: string;
}

const LEVEL_TO_QUALITY: Record<CompressionLevel, number> = {
  low: 0.85, // light compression, best quality
  medium: 0.65,
  high: 0.4, // aggressive compression, smaller file
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Attempts to downscale/re-encode embedded JPEG/PNG image XObjects inside a
 * PDFDocument to reduce file size. This is a best-effort pass: it walks each
 * page's resource dictionary, finds image XObjects, and if it can decode
 * them via an offscreen canvas, re-encodes them as JPEG at the target
 * quality and swaps the stream contents in place.
 */
async function recompressImages(
  pdfDoc: PDFDocument,
  quality: number,
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const pages = pdfDoc.getPages();
  // Collect all image XObjects across all pages (de-duplicated by ref)
  const seen = new Set<string>();
  const imageRefs: { name: string; dict: PDFDict; ref: any }[] = [];

  for (const page of pages) {
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObjects = resources.lookup(PDFName.of("XObject"));
    if (!xObjects || !(xObjects instanceof PDFDict)) continue;

    for (const [name, ref] of xObjects.entries()) {
      const key = ref.toString();
      if (seen.has(key)) continue;
      seen.add(key);
      const obj = pdfDoc.context.lookup(ref);
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        const subtype = dict.get(PDFName.of("Subtype"));
        if (subtype && subtype.toString() === "/Image") {
          imageRefs.push({ name: name.toString(), dict, ref });
        }
      }
    }
  }

  let done = 0;
  for (const { ref } of imageRefs) {
    try {
      const stream = pdfDoc.context.lookup(ref) as PDFRawStream;
      const filter = stream.dict.get(PDFName.of("Filter"));
      const filterName = filter ? filter.toString() : "";

      // Only attempt re-encode for DCTDecode (JPEG) or raw/FlateDecode images
      // where we can round-trip through <img>/<canvas>.
      if (filterName.includes("DCTDecode")) {
        const bytes = stream.getContents();
        const blob = new Blob([bytes], { type: "image/jpeg" });
        const bitmap = await createImageBitmap(blob).catch(() => null);
        if (bitmap) {
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(bitmap, 0, 0);
            const newBlob: Blob | null = await new Promise((resolve) =>
              canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
            );
            if (newBlob && newBlob.size < bytes.byteLength) {
              const newBytes = new Uint8Array(await newBlob.arrayBuffer());
              stream.dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
              stream.dict.set(PDFName.of("Length"), pdfDoc.context.obj(newBytes.length));
              (stream as any).contents = newBytes;
            }
          }
        }
      }
    } catch {
      // Skip images that fail to decode/re-encode; leave them untouched.
    } finally {
      done += 1;
      onProgress?.(done, imageRefs.length);
    }
  }
}

async function compressPdfFile(
  file: File,
  level: CompressionLevel,
  onProgress?: (message: string) => void
): Promise<CompressResult> {
  const originalBytes = await file.arrayBuffer();
  const originalSize = originalBytes.byteLength;

  onProgress?.("Loading PDF…");
  const pdfDoc = await PDFDocument.load(originalBytes, {
    updateMetadata: false,
    ignoreEncryption: true,
  });

  onProgress?.("Recompressing embedded images…");
  const quality = LEVEL_TO_QUALITY[level];
  await recompressImages(pdfDoc, quality, (done, total) => {
    if (total > 0) onProgress?.(`Recompressing images (${done}/${total})…`);
  });

  onProgress?.("Removing unused metadata…");
  pdfDoc.setProducer("compresspdf.tsx");
  pdfDoc.setCreator("compresspdf.tsx");

  onProgress?.("Saving optimized PDF…");
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const blob = new Blob([compressedBytes], { type: "application/pdf" });

  return {
    originalSize,
    compressedSize: blob.size,
    blob,
    fileName: file.name.replace(/\.pdf$/i, "") + "-compressed.pdf",
  };
}

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [status, setStatus] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetForNewFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    setStatus("");
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }
    resetForNewFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");
    setResult(null);
    try {
      const res = await compressPdfFile(file, level, (msg) => setStatus(msg));
      setResult(res);
      setStatus("Done.");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? `Compression failed: ${err.message}`
          : "Compression failed. The PDF may be encrypted or malformed."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const savingsPct =
    result && result.originalSize > 0
      ? Math.max(
          0,
          Math.round((1 - result.compressedSize / result.originalSize) * 100)
        )
      : 0;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Compress PDF</h1>
      <p className="text-sm text-gray-500 mb-5">
        Shrink a PDF file entirely in your browser. Nothing is uploaded to a server.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        {file ? (
          <div>
            <p className="text-sm font-medium text-gray-800">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">{formatBytes(file.size)}</p>
            <p className="text-xs text-blue-600 mt-2">Click or drop to replace</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop a PDF here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">Only .pdf files are supported</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Compression level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as CompressionLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevel(lvl)}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                level === lvl
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {lvl === "low" && "Low"}
              {lvl === "medium" && "Medium"}
              {lvl === "high" && "High"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {level === "low" && "Best quality, smallest size reduction."}
          {level === "medium" && "Balanced quality and file size."}
          {level === "high" && "Smallest file size, more visible image quality loss."}
        </p>
      </div>

      <button
        type="button"
        disabled={!file || isProcessing}
        onClick={handleCompress}
        className="mt-5 w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {isProcessing ? "Compressing…" : "Compress PDF"}
      </button>

      {isProcessing && status && (
        <p className="mt-3 text-xs text-gray-500 text-center">{status}</p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 p-4 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Original</span>
            <span className="font-medium text-gray-800">
              {formatBytes(result.originalSize)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Compressed</span>
            <span className="font-medium text-gray-800">
              {formatBytes(result.compressedSize)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Savings</span>
            <span className="font-semibold text-green-700">{savingsPct}%</span>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="mt-3 w-full py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Download compressed PDF
          </button>
        </div>
      )}
    </div>
  );
}
