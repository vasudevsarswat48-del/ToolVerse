"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, Image as ImageIcon, RefreshCw, FileCheck, Layers, Settings2 } from "lucide-react";

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
}

export default function PdfToImage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [scale, setScale] = useState<number>(2); // 2x resolution for crisp output
  const [isProcessing, setIsProcessing] = useState(false);
  const [pages, setPages] = useState<RenderedPage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPages([]);
    }
  };

  const handleConvertToImages = async () => {
    if (!pdfFile) return;

    try {
      setIsProcessing(true);
      setPages([]);

      // Load pdfjs dynamically on client side
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdfDoc.numPages;
      const renderedPages: RenderedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, 0.92);

        renderedPages.push({
          pageNumber: i,
          dataUrl,
        });
      }

      setPages(renderedPages);
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      alert("Failed to render PDF pages. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (dataUrl: string, pageNum: number) => {
    const link = document.createElement("a");
    const baseName = pdfFile?.name.replace(/\.[^/.]+$/, "") || "document";
    link.href = dataUrl;
    link.download = `${baseName}_page_${pageNum}.${format}`;
    link.click();
  };

  const downloadAllImages = () => {
    pages.forEach((page) => {
      downloadImage(page.dataUrl, page.pageNumber);
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" /> 1. Select PDF File
            </h3>
            <p className="text-xs text-slate-400 mt-1">Upload the document to extract pages as high-res images</p>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-800/40">
            <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs text-slate-200 font-medium truncate max-w-[200px]">
              {pdfFile ? pdfFile.name : "Choose PDF file"}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Step 2: Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-purple-400" /> 2. Export Format & Resolution
          </h3>

          <div className="space-y-3">
            {/* Image Format */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">Output Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat("png")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    format === "png"
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  PNG (Lossless)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("jpeg")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    format === "jpeg"
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  JPEG (Compact)
                </button>
              </div>
            </div>

            {/* Resolution/Scale */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">Quality Scale ({scale}x DPI)</label>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={1}>1x (Standard 72 DPI)</option>
                <option value={2}>2x (High Quality 144 DPI)</option>
                <option value={3}>3x (Ultra HD 216 DPI)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Convert & Extract</h4>
          <p className="text-xs text-slate-400">Renders every page into standalone high-quality image files</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleConvertToImages}
            disabled={!pdfFile || isProcessing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {isProcessing ? "Rendering Pages..." : "Convert PDF to Images"}
          </button>

          {pages.length > 0 && (
            <button
              onClick={downloadAllImages}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download All ({pages.length})
            </button>
          )}
        </div>
      </div>

      {/* Pages Gallery Preview */}
      {pages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Extracted Pages ({pages.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between p-3 space-y-3 group hover:border-slate-700 transition-colors"
              >
                <div className="bg-slate-950 rounded-lg p-2 overflow-hidden flex items-center justify-center border border-slate-800/80 aspect-[3/4]">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="max-h-full object-contain rounded shadow"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-semibold text-slate-300">Page {page.pageNumber}</span>
                  <button
                    onClick={() => downloadImage(page.dataUrl, page.pageNumber)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
